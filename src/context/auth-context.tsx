import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, ADMIN_EMAIL } from "@/lib/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firestore-error";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt?: string;
}

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
};

interface AuthContextType {
  user: AppUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helpers for unified canonical name by email (shared across Google and manual login)
export const getCanonicalNameForEmail = (email: string): string => {
  const clean = email.trim().toLowerCase();
  if (!clean) return "";
  const direct = localStorage.getItem(`al_canonical_name_${clean}`);
  if (direct && direct.trim()) return direct.trim();

  try {
    const raw = localStorage.getItem("al_local_accounts");
    if (raw) {
      const accounts = JSON.parse(raw);
      if (accounts[clean]?.name && accounts[clean].name.trim()) {
        return accounts[clean].name.trim();
      }
    }
  } catch {
    // ignore
  }

  return "";
};

export const setCanonicalNameForEmail = (email: string, name: string) => {
  const clean = email.trim().toLowerCase();
  const trimmed = name.trim();
  if (!clean || !trimmed) return;

  localStorage.setItem(`al_canonical_name_${clean}`, trimmed);

  try {
    const raw = localStorage.getItem("al_local_accounts");
    const accounts = raw ? JSON.parse(raw) : {};
    if (accounts[clean]) {
      accounts[clean].name = trimmed;
    } else {
      accounts[clean] = {
        name: trimmed,
        pass: "",
        uid: `usr_${clean.replace(/[^a-z0-9]/g, "")}`,
      };
    }
    localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
  } catch {
    // ignore
  }

  try {
    const activeRaw = localStorage.getItem("al_active_local_user");
    if (activeRaw) {
      const active = JSON.parse(activeRaw);
      if (active.email?.toLowerCase() === clean) {
        active.displayName = trimmed;
        localStorage.setItem("al_active_local_user", JSON.stringify(active));
      }
    }
  } catch {
    // ignore
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore or local storage with unified email-based account linking
  const syncProfile = useCallback(async (appUser: AppUser) => {
    const cleanEmail = (appUser.email || "").trim().toLowerCase();
    const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

    // Check if there's any local account or phone linked to this email (from manual sign up or past session)
    let localPhone = "";
    let localName = "";
    try {
      const storedAccountsRaw = localStorage.getItem("al_local_accounts");
      if (storedAccountsRaw) {
        const accounts = JSON.parse(storedAccountsRaw);
        if (cleanEmail && accounts[cleanEmail]) {
          localPhone = accounts[cleanEmail].phone || "";
          localName = accounts[cleanEmail].name || "";
          // Link UID to ensure single unified account identity
          accounts[cleanEmail].uid = appUser.uid;
          localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
        }
      }
    } catch {
      // ignore
    }

    // Determine the single unified canonical user name for this email
    let canonicalName = getCanonicalNameForEmail(cleanEmail);

    if (!canonicalName) {
      canonicalName =
        localName ||
        (appUser.displayName || "").trim() ||
        (isUserAdmin ? "Affordable Laundry Admin" : "");

      if (!canonicalName && cleanEmail) {
        const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
        canonicalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }

      if (canonicalName) {
        setCanonicalNameForEmail(cleanEmail, canonicalName);
      }
    } else {
      setCanonicalNameForEmail(cleanEmail, canonicalName);
    }

    // If Firebase currentUser exists, sync its displayName to the unified canonical name
    if (auth.currentUser && canonicalName && auth.currentUser.displayName !== canonicalName) {
      updateProfile(auth.currentUser, { displayName: canonicalName }).catch(() => {});
    }

    // Update appUser state to always show the unified canonical name
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.displayName !== canonicalName) {
        return { ...prev, displayName: canonicalName };
      }
      return prev;
    });

    try {
      const userRef = doc(db, "users", appUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        const finalRole = isUserAdmin ? "admin" : data.role || "customer";
        const unifiedProfile: UserProfile = {
          ...data,
          email: cleanEmail,
          phone: data.phone || localPhone || "",
          displayName: canonicalName, // Always enforce single unified name
          role: finalRole,
        };

        // Update user record with latest merged phone and canonical displayName
        try {
          await setDoc(
            userRef,
            { displayName: canonicalName, phone: unifiedProfile.phone },
            { merge: true },
          );
        } catch {
          // ignore
        }

        setProfile(unifiedProfile);
        setIsAdmin(finalRole === "admin");
      } else {
        const newProfile: UserProfile = {
          id: appUser.uid,
          email: cleanEmail,
          displayName: canonicalName,
          phone: localPhone || "",
          role: isUserAdmin ? "admin" : "customer",
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(userRef, newProfile);
        } catch {
          // If firestore rules block guest write, store locally
        }
        setProfile(newProfile);
        setIsAdmin(isUserAdmin);
      }
    } catch {
      // Offline or permission fallback
      const fallbackProfile: UserProfile = {
        id: appUser.uid,
        email: cleanEmail,
        displayName: canonicalName,
        phone: localPhone || "",
        role: isUserAdmin ? "admin" : "customer",
        createdAt: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
      setIsAdmin(isUserAdmin);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const isUserAdmin = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        setIsAdmin(isUserAdmin);
        await syncProfile(currentUser);
        setLoading(false);
      } else {
        // Check for local session fallback
        try {
          const stored = localStorage.getItem("al_active_local_user");
          if (stored) {
            const parsed = JSON.parse(stored) as AppUser;
            setUser(parsed);
            const isUserAdmin = parsed.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            setIsAdmin(isUserAdmin);
            await syncProfile(parsed);
          } else {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
        } catch {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [syncProfile]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const cleanEmail = (res.user.email || "").trim().toLowerCase();

      // Check for an existing canonical name for this email (from manual sign up or past session)
      let canonicalName = getCanonicalNameForEmail(cleanEmail);

      if (canonicalName) {
        // Enforce the existing unified name on the Google account
        await updateProfile(res.user, { displayName: canonicalName }).catch(() => {});
      } else if (res.user.displayName && res.user.displayName.trim()) {
        // If Google is the first to provide a name, record it as the canonical name for this email
        canonicalName = res.user.displayName.trim();
        setCanonicalNameForEmail(cleanEmail, canonicalName);
      } else {
        const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
        canonicalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setCanonicalNameForEmail(cleanEmail, canonicalName);
        await updateProfile(res.user, { displayName: canonicalName }).catch(() => {});
      }

      // Link with any existing manual account created with this same email
      try {
        const storedAccountsRaw = localStorage.getItem("al_local_accounts");
        if (storedAccountsRaw && cleanEmail) {
          const accounts = JSON.parse(storedAccountsRaw);
          if (accounts[cleanEmail]) {
            accounts[cleanEmail].uid = res.user.uid;
            accounts[cleanEmail].name = canonicalName;
            localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
          }
        }
      } catch {
        // ignore
      }

      localStorage.removeItem("al_active_local_user");
      toast.success(`Welcome back, ${canonicalName}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign in failed";
      if (!msg.includes("popup-closed-by-user")) {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const canonicalName = getCanonicalNameForEmail(cleanEmail);

    try {
      // First attempt Firebase Auth
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      localStorage.removeItem("al_active_local_user");
      const nameToShow = canonicalName || res.user.displayName || cleanEmail;
      if (canonicalName && res.user.displayName !== canonicalName) {
        updateProfile(res.user, { displayName: canonicalName }).catch(() => {});
      }
      toast.success(`Welcome back, ${nameToShow}!`);
      return;
    } catch (firebaseErr: unknown) {
      // If Firebase failed, fallback to local registered accounts
      console.warn("Firebase email sign-in fallback triggered:", firebaseErr);

      try {
        const storedAccountsRaw = localStorage.getItem("al_local_accounts");
        const accounts: Record<
          string,
          { pass: string; name: string; phone?: string; uid: string }
        > = storedAccountsRaw ? JSON.parse(storedAccountsRaw) : {};

        const existing = accounts[cleanEmail];

        // If it's the known admin email or registered local user
        if (existing) {
          if (existing.pass !== pass) {
            toast.error("Incorrect password. Please check and try again.");
            throw new Error("Incorrect password.");
          }

          const effectiveName = canonicalName || existing.name;
          const localUser: AppUser = {
            uid: existing.uid,
            email: cleanEmail,
            displayName: effectiveName,
            phoneNumber: existing.phone || null,
          };

          localStorage.setItem("al_active_local_user", JSON.stringify(localUser));
          setUser(localUser);
          const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
          setIsAdmin(isUserAdmin);
          await syncProfile(localUser);
          toast.success(`Welcome back, ${effectiveName}!`);
          return;
        }

        // If it's the admin email signing in for the first time
        if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
          const effectiveAdminName = canonicalName || "Affordable Laundry Admin";
          const adminUser: AppUser = {
            uid: "admin_local_master",
            email: cleanEmail,
            displayName: effectiveAdminName,
          };
          localStorage.setItem("al_active_local_user", JSON.stringify(adminUser));
          setUser(adminUser);
          setIsAdmin(true);
          await syncProfile(adminUser);
          toast.success("Welcome back, Laundry Manager!");
          return;
        }

        // Otherwise create the account on the fly for ease of use
        const generatedUid = `usr_${cleanEmail.replace(/[^a-z0-9]/g, "")}_${Date.now().toString().slice(-4)}`;
        let effectiveName = canonicalName;
        if (!effectiveName) {
          const autoName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
          effectiveName = autoName.charAt(0).toUpperCase() + autoName.slice(1);
          setCanonicalNameForEmail(cleanEmail, effectiveName);
        }

        accounts[cleanEmail] = { pass, name: effectiveName, uid: generatedUid };
        localStorage.setItem("al_local_accounts", JSON.stringify(accounts));

        const newUser: AppUser = {
          uid: generatedUid,
          email: cleanEmail,
          displayName: effectiveName,
        };

        localStorage.setItem("al_active_local_user", JSON.stringify(newUser));
        setUser(newUser);
        await syncProfile(newUser);
        toast.success(`Signed in as ${effectiveName}!`);
      } catch (innerErr) {
        if (innerErr instanceof Error && innerErr.message === "Incorrect password.") {
          throw innerErr;
        }
        toast.error("Unable to sign in. Please verify your details.");
        throw innerErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Register canonical name immediately for this email
    if (trimmedName) {
      setCanonicalNameForEmail(cleanEmail, trimmedName);
    }

    try {
      // First try Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(res.user, { displayName: trimmedName });
      localStorage.removeItem("al_active_local_user");

      const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
      const userProfile: UserProfile = {
        id: res.user.uid,
        email: cleanEmail,
        displayName: trimmedName,
        phone: phone || "",
        role: isUserAdmin ? "admin" : "customer",
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, "users", res.user.uid), userProfile);
        setProfile(userProfile);
        setIsAdmin(isUserAdmin);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${res.user.uid}`, res.user);
      }

      toast.success("Account created successfully!");
      return;
    } catch (firebaseErr: unknown) {
      console.warn("Firebase email sign-up fallback triggered:", firebaseErr);

      // Create or link user locally
      const storedAccountsRaw = localStorage.getItem("al_local_accounts");
      const accounts: Record<string, { pass: string; name: string; phone?: string; uid: string }> =
        storedAccountsRaw ? JSON.parse(storedAccountsRaw) : {};

      const existingAccount = accounts[cleanEmail];
      const existingUid = existingAccount?.uid;
      const generatedUid =
        existingUid ||
        `usr_${cleanEmail.replace(/[^a-z0-9]/g, "")}_${Date.now().toString().slice(-4)}`;

      accounts[cleanEmail] = {
        pass,
        name: trimmedName || existingAccount?.name || "Customer",
        phone: phone || existingAccount?.phone || "",
        uid: generatedUid,
      };
      localStorage.setItem("al_local_accounts", JSON.stringify(accounts));

      const localUser: AppUser = {
        uid: generatedUid,
        email: cleanEmail,
        displayName: trimmedName || existingAccount?.name || "Customer",
        phoneNumber: phone || null,
      };

      localStorage.setItem("al_active_local_user", JSON.stringify(localUser));
      setUser(localUser);

      const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
      const userProfile: UserProfile = {
        id: generatedUid,
        email: cleanEmail,
        displayName: trimmedName || existingAccount?.name || "Customer",
        phone: phone || "",
        role: isUserAdmin ? "admin" : "customer",
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, "users", generatedUid), userProfile);
      } catch {
        // Local only fallback
      }

      setProfile(userProfile);
      setIsAdmin(isUserAdmin);
      toast.success(`Welcome to Affordable Laundry, ${trimmedName || "Customer"}!`);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (newName: string) => {
    const trimmed = newName.trim();
    if (!user || !trimmed) return;
    const cleanEmail = (user.email || "").trim().toLowerCase();

    setCanonicalNameForEmail(cleanEmail, trimmed);

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch {
        // ignore
      }
    }

    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        { displayName: trimmed, updatedAt: new Date().toISOString() },
        { merge: true },
      );
    } catch {
      // ignore
    }

    setUser((prev) => (prev ? { ...prev, displayName: trimmed } : null));
    setProfile((prev) => (prev ? { ...prev, displayName: trimmed } : null));
    toast.success(`Name updated to ${trimmed}!`);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem("al_active_local_user");
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    toast.success("Signed out successfully.");
  };

  const updateUserPhone = async (phone: string) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { phone, updatedAt: new Date().toISOString() }, { merge: true });
      setProfile((prev) => (prev ? { ...prev, phone } : null));
      toast.success("Contact details updated");
    } catch {
      setProfile((prev) => (prev ? { ...prev, phone } : null));
      toast.success("Phone number saved");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateUserPhone,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
