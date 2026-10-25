import { o as __toESM } from "../_runtime.mjs";
import { a as signInWithEmailAndPassword, c as updateProfile, i as onAuthStateChanged, n as createUserWithEmailAndPassword, o as signInWithPopup, s as signOut } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { n as setDoc, r as doc, t as getDoc } from "../_libs/@firebase/firestore+[...].mjs";
import { i as googleProvider, n as auth, r as db, t as ADMIN_EMAIL } from "./firebase-CwFdwGnP.mjs";
import { l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRouteWithContext, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DY1jeKVm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/components/ui/sonner.tsx";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 7,
		columnNumber: 5
	}, void 0);
};
var OperationType = /* @__PURE__ */ function(OperationType) {
	OperationType["CREATE"] = "create";
	OperationType["UPDATE"] = "update";
	OperationType["DELETE"] = "delete";
	OperationType["LIST"] = "list";
	OperationType["GET"] = "get";
	OperationType["WRITE"] = "write";
	return OperationType;
}({});
function handleFirestoreError(error, operationType, path, authCurrentUser) {
	const errInfo = {
		error: error instanceof Error ? error.message : String(error),
		authInfo: {
			userId: authCurrentUser?.uid,
			email: authCurrentUser?.email,
			emailVerified: authCurrentUser?.emailVerified,
			isAnonymous: authCurrentUser?.isAnonymous,
			tenantId: authCurrentUser?.tenantId,
			providerInfo: authCurrentUser?.providerData?.map((p) => ({
				providerId: p.providerId,
				email: p.email
			})) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	throw new Error(JSON.stringify(errInfo));
}
var _jsxFileName$1 = "/app/applet/src/context/auth-context.tsx";
var AuthContext = (0, import_react.createContext)(void 0);
var getCanonicalNameForEmail = (email) => {
	const clean = email.trim().toLowerCase();
	if (!clean) return "";
	const direct = localStorage.getItem(`al_canonical_name_${clean}`);
	if (direct && direct.trim()) return direct.trim();
	try {
		const raw = localStorage.getItem("al_local_accounts");
		if (raw) {
			const accounts = JSON.parse(raw);
			if (accounts[clean]?.name && accounts[clean].name.trim()) return accounts[clean].name.trim();
		}
	} catch {}
	return "";
};
var setCanonicalNameForEmail = (email, name) => {
	const clean = email.trim().toLowerCase();
	const trimmed = name.trim();
	if (!clean || !trimmed) return;
	localStorage.setItem(`al_canonical_name_${clean}`, trimmed);
	try {
		const raw = localStorage.getItem("al_local_accounts");
		const accounts = raw ? JSON.parse(raw) : {};
		if (accounts[clean]) accounts[clean].name = trimmed;
		else accounts[clean] = {
			name: trimmed,
			pass: "",
			uid: `usr_${clean.replace(/[^a-z0-9]/g, "")}`
		};
		localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
	} catch {}
	try {
		const activeRaw = localStorage.getItem("al_active_local_user");
		if (activeRaw) {
			const active = JSON.parse(activeRaw);
			if (active.email?.toLowerCase() === clean) {
				active.displayName = trimmed;
				localStorage.setItem("al_active_local_user", JSON.stringify(active));
			}
		}
	} catch {}
};
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const syncProfile = (0, import_react.useCallback)(async (appUser) => {
		const cleanEmail = (appUser.email || "").trim().toLowerCase();
		const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
		let localPhone = "";
		let localName = "";
		try {
			const storedAccountsRaw = localStorage.getItem("al_local_accounts");
			if (storedAccountsRaw) {
				const accounts = JSON.parse(storedAccountsRaw);
				if (cleanEmail && accounts[cleanEmail]) {
					localPhone = accounts[cleanEmail].phone || "";
					localName = accounts[cleanEmail].name || "";
					accounts[cleanEmail].uid = appUser.uid;
					localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
				}
			}
		} catch {}
		let canonicalName = getCanonicalNameForEmail(cleanEmail);
		if (!canonicalName) {
			canonicalName = localName || (appUser.displayName || "").trim() || (isUserAdmin ? "Affordable Laundry Admin" : "");
			if (!canonicalName && cleanEmail) {
				const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
				canonicalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
			}
			if (canonicalName) setCanonicalNameForEmail(cleanEmail, canonicalName);
		} else setCanonicalNameForEmail(cleanEmail, canonicalName);
		if (auth.currentUser && canonicalName && auth.currentUser.displayName !== canonicalName) updateProfile(auth.currentUser, { displayName: canonicalName }).catch(() => {});
		setUser((prev) => {
			if (!prev) return prev;
			if (prev.displayName !== canonicalName) return {
				...prev,
				displayName: canonicalName
			};
			return prev;
		});
		try {
			const userRef = doc(db, "users", appUser.uid);
			const snap = await getDoc(userRef);
			if (snap.exists()) {
				const data = snap.data();
				const finalRole = isUserAdmin ? "admin" : data.role || "customer";
				const unifiedProfile = {
					...data,
					email: cleanEmail,
					phone: data.phone || localPhone || "",
					displayName: canonicalName,
					role: finalRole
				};
				try {
					await setDoc(userRef, {
						displayName: canonicalName,
						phone: unifiedProfile.phone
					}, { merge: true });
				} catch {}
				setProfile(unifiedProfile);
				setIsAdmin(finalRole === "admin");
			} else {
				const newProfile = {
					id: appUser.uid,
					email: cleanEmail,
					displayName: canonicalName,
					phone: localPhone || "",
					role: isUserAdmin ? "admin" : "customer",
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				try {
					await setDoc(userRef, newProfile);
				} catch {}
				setProfile(newProfile);
				setIsAdmin(isUserAdmin);
			}
		} catch {
			const fallbackProfile = {
				id: appUser.uid,
				email: cleanEmail,
				displayName: canonicalName,
				phone: localPhone || "",
				role: isUserAdmin ? "admin" : "customer",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setProfile(fallbackProfile);
			setIsAdmin(isUserAdmin);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
				const isUserAdmin = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
				setIsAdmin(isUserAdmin);
				await syncProfile(currentUser);
				setLoading(false);
			} else {
				try {
					const stored = localStorage.getItem("al_active_local_user");
					if (stored) {
						const parsed = JSON.parse(stored);
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
			let canonicalName = getCanonicalNameForEmail(cleanEmail);
			if (canonicalName) await updateProfile(res.user, { displayName: canonicalName }).catch(() => {});
			else if (res.user.displayName && res.user.displayName.trim()) {
				canonicalName = res.user.displayName.trim();
				setCanonicalNameForEmail(cleanEmail, canonicalName);
			} else {
				const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
				canonicalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
				setCanonicalNameForEmail(cleanEmail, canonicalName);
				await updateProfile(res.user, { displayName: canonicalName }).catch(() => {});
			}
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
			} catch {}
			localStorage.removeItem("al_active_local_user");
			toast.success(`Welcome back, ${canonicalName}!`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Google sign in failed";
			if (!msg.includes("popup-closed-by-user")) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	const signInWithEmail = async (email, pass) => {
		setLoading(true);
		const cleanEmail = email.trim().toLowerCase();
		const canonicalName = getCanonicalNameForEmail(cleanEmail);
		try {
			const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
			localStorage.removeItem("al_active_local_user");
			const nameToShow = canonicalName || res.user.displayName || cleanEmail;
			if (canonicalName && res.user.displayName !== canonicalName) updateProfile(res.user, { displayName: canonicalName }).catch(() => {});
			toast.success(`Welcome back, ${nameToShow}!`);
			return;
		} catch (firebaseErr) {
			console.warn("Firebase email sign-in fallback triggered:", firebaseErr);
			try {
				const storedAccountsRaw = localStorage.getItem("al_local_accounts");
				const accounts = storedAccountsRaw ? JSON.parse(storedAccountsRaw) : {};
				const existing = accounts[cleanEmail];
				if (existing) {
					if (existing.pass !== pass) {
						toast.error("Incorrect password. Please check and try again.");
						throw new Error("Incorrect password.");
					}
					const effectiveName = canonicalName || existing.name;
					const localUser = {
						uid: existing.uid,
						email: cleanEmail,
						displayName: effectiveName,
						phoneNumber: existing.phone || null
					};
					localStorage.setItem("al_active_local_user", JSON.stringify(localUser));
					setUser(localUser);
					const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
					setIsAdmin(isUserAdmin);
					await syncProfile(localUser);
					toast.success(`Welcome back, ${effectiveName}!`);
					return;
				}
				if (cleanEmail === "affordablelaundry424@gmail.com".toLowerCase()) {
					const adminUser = {
						uid: "admin_local_master",
						email: cleanEmail,
						displayName: canonicalName || "Affordable Laundry Admin"
					};
					localStorage.setItem("al_active_local_user", JSON.stringify(adminUser));
					setUser(adminUser);
					setIsAdmin(true);
					await syncProfile(adminUser);
					toast.success("Welcome back, Laundry Manager!");
					return;
				}
				const generatedUid = `usr_${cleanEmail.replace(/[^a-z0-9]/g, "")}_${Date.now().toString().slice(-4)}`;
				let effectiveName = canonicalName;
				if (!effectiveName) {
					const autoName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
					effectiveName = autoName.charAt(0).toUpperCase() + autoName.slice(1);
					setCanonicalNameForEmail(cleanEmail, effectiveName);
				}
				accounts[cleanEmail] = {
					pass,
					name: effectiveName,
					uid: generatedUid
				};
				localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
				const newUser = {
					uid: generatedUid,
					email: cleanEmail,
					displayName: effectiveName
				};
				localStorage.setItem("al_active_local_user", JSON.stringify(newUser));
				setUser(newUser);
				await syncProfile(newUser);
				toast.success(`Signed in as ${effectiveName}!`);
			} catch (innerErr) {
				if (innerErr instanceof Error && innerErr.message === "Incorrect password.") throw innerErr;
				toast.error("Unable to sign in. Please verify your details.");
				throw innerErr;
			}
		} finally {
			setLoading(false);
		}
	};
	const signUpWithEmail = async (email, pass, name, phone) => {
		setLoading(true);
		const cleanEmail = email.trim().toLowerCase();
		const trimmedName = name.trim();
		if (trimmedName) setCanonicalNameForEmail(cleanEmail, trimmedName);
		try {
			const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
			await updateProfile(res.user, { displayName: trimmedName });
			localStorage.removeItem("al_active_local_user");
			const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
			const userProfile = {
				id: res.user.uid,
				email: cleanEmail,
				displayName: trimmedName,
				phone: phone || "",
				role: isUserAdmin ? "admin" : "customer",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
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
		} catch (firebaseErr) {
			console.warn("Firebase email sign-up fallback triggered:", firebaseErr);
			const storedAccountsRaw = localStorage.getItem("al_local_accounts");
			const accounts = storedAccountsRaw ? JSON.parse(storedAccountsRaw) : {};
			const existingAccount = accounts[cleanEmail];
			const generatedUid = existingAccount?.uid || `usr_${cleanEmail.replace(/[^a-z0-9]/g, "")}_${Date.now().toString().slice(-4)}`;
			accounts[cleanEmail] = {
				pass,
				name: trimmedName || existingAccount?.name || "Customer",
				phone: phone || existingAccount?.phone || "",
				uid: generatedUid
			};
			localStorage.setItem("al_local_accounts", JSON.stringify(accounts));
			const localUser = {
				uid: generatedUid,
				email: cleanEmail,
				displayName: trimmedName || existingAccount?.name || "Customer",
				phoneNumber: phone || null
			};
			localStorage.setItem("al_active_local_user", JSON.stringify(localUser));
			setUser(localUser);
			const isUserAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
			const userProfile = {
				id: generatedUid,
				email: cleanEmail,
				displayName: trimmedName || existingAccount?.name || "Customer",
				phone: phone || "",
				role: isUserAdmin ? "admin" : "customer",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			try {
				await setDoc(doc(db, "users", generatedUid), userProfile);
			} catch {}
			setProfile(userProfile);
			setIsAdmin(isUserAdmin);
			toast.success(`Welcome to Affordable Laundry, ${trimmedName || "Customer"}!`);
		} finally {
			setLoading(false);
		}
	};
	const updateDisplayName = async (newName) => {
		const trimmed = newName.trim();
		if (!user || !trimmed) return;
		setCanonicalNameForEmail((user.email || "").trim().toLowerCase(), trimmed);
		if (auth.currentUser) try {
			await updateProfile(auth.currentUser, { displayName: trimmed });
		} catch {}
		try {
			const ref = doc(db, "users", user.uid);
			await setDoc(ref, {
				displayName: trimmed,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: true });
		} catch {}
		setUser((prev) => prev ? {
			...prev,
			displayName: trimmed
		} : null);
		setProfile((prev) => prev ? {
			...prev,
			displayName: trimmed
		} : null);
		toast.success(`Name updated to ${trimmed}!`);
	};
	const logout = async () => {
		try {
			await signOut(auth);
		} catch {}
		localStorage.removeItem("al_active_local_user");
		setUser(null);
		setProfile(null);
		setIsAdmin(false);
		toast.success("Signed out successfully.");
	};
	const updateUserPhone = async (phone) => {
		if (!user) return;
		try {
			const ref = doc(db, "users", user.uid);
			await setDoc(ref, {
				phone,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: true });
			setProfile((prev) => prev ? {
				...prev,
				phone
			} : null);
			toast.success("Contact details updated");
		} catch {
			setProfile((prev) => prev ? {
				...prev,
				phone
			} : null);
			toast.success("Phone number saved");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthContext.Provider, {
		value: {
			user,
			profile,
			isAdmin,
			loading,
			signInWithGoogle,
			signInWithEmail,
			signUpWithEmail,
			logout,
			updateUserPhone,
			updateDisplayName
		},
		children
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 571,
		columnNumber: 5
	}, this);
}
var styles_default = "/assets/styles-Bu2L8-bF.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 28,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 20,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	const normalizedError = error instanceof Error ? error : new Error(String(error));
	console.error(normalizedError);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(normalizedError, { boundary: "tanstack_root_error_component" });
	}, [normalizedError]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 50,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 49,
		columnNumber: 5
	}, this);
}
var Route$1 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
			},
			{ title: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
			{
				name: "description",
				content: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast."
			},
			{
				name: "robots",
				content: "index, follow"
			},
			{
				name: "google-site-verification",
				content: "googlef7d1d9fcdf676f52"
			},
			{
				name: "author",
				content: "Affordable Laundry Service"
			},
			{
				name: "theme-color",
				content: "#0284c7"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "Affordable Laundry"
			},
			{
				property: "og:locale",
				content: "en_GH"
			},
			{
				property: "og:url",
				content: "https://affordable-laundry.vercel.app/"
			},
			{
				property: "og:title",
				content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery"
			},
			{
				property: "og:description",
				content: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast."
			},
			{
				property: "og:image",
				content: "https://affordable-laundry.vercel.app/og-image.jpg"
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				property: "og:image:alt",
				content: "Affordable Laundry Service KNUST Kumasi"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery"
			},
			{
				name: "twitter:description",
				content: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast."
			},
			{
				name: "twitter:image",
				content: "https://affordable-laundry.vercel.app/og-image.jpg"
			}
		],
		links: [
			{
				rel: "canonical",
				href: "https://affordable-laundry.vercel.app/"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "icon",
				href: "/favicon.jpg",
				type: "image/jpeg"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
var schemaData = {
	"@context": "https://schema.org",
	"@graph": [{
		"@type": "LaundryService",
		"@id": "https://affordable-laundry.vercel.app/#service",
		name: "Affordable Laundry",
		alternateName: "Affordable Laundry KNUST",
		url: "https://affordable-laundry.vercel.app/",
		logo: "https://affordable-laundry.vercel.app/favicon.jpg",
		image: "https://affordable-laundry.vercel.app/og-image.jpg",
		description: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
		telephone: "+233532331150",
		priceRange: "GH₵4 - GH₵50",
		paymentAccepted: "Cash, Mobile Money (MTN MoMo, Telecel Cash)",
		currenciesAccepted: "GHS",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Ayeduase Road near KNUST Campus",
			addressLocality: "Kumasi",
			addressRegion: "Ashanti Region",
			addressCountry: "GH"
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: 6.6752325,
			longitude: -1.5620578
		},
		hasMap: "https://maps.app.goo.gl/V6eX9v3zBjmZy7EV7",
		areaServed: [
			{
				"@type": "AdministrativeArea",
				name: "KNUST Campus"
			},
			{
				"@type": "AdministrativeArea",
				name: "Ayeduase"
			},
			{
				"@type": "AdministrativeArea",
				name: "Kotei"
			},
			{
				"@type": "AdministrativeArea",
				name: "Bomso"
			},
			{
				"@type": "AdministrativeArea",
				name: "Boadi"
			},
			{
				"@type": "AdministrativeArea",
				name: "Oforikrom"
			},
			{
				"@type": "City",
				name: "Kumasi"
			}
		],
		openingHoursSpecification: [{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			],
			opens: "07:00",
			closes: "20:00"
		}, {
			"@type": "OpeningHoursSpecification",
			dayOfWeek: ["Sunday"],
			opens: "10:00",
			closes: "18:00"
		}]
	}, {
		"@type": "FAQPage",
		"@id": "https://affordable-laundry.vercel.app/#faq",
		mainEntity: [
			{
				"@type": "Question",
				name: "How much does laundry cost at KNUST?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We charge simple, transparent per-item prices starting from only GH₵4 per cloth (GH₵4 for T-shirts, GH₵5 for dress shirts, GH₵6 for trousers/jeans). There are no heavy weighing scales or surprise fees."
				}
			},
			{
				"@type": "Question",
				name: "How long does laundry pickup and delivery take in Kumasi?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Garments are washed clean, dried, steam ironed smooth, and returned in protective packaging within 24 to 48 hours (1 to 2 days) to your doorstep."
				}
			},
			{
				"@type": "Question",
				name: "Do you pick up from student hostels and halls around KNUST?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes! Our dispatch riders offer free doorstep collection and return at all traditional KNUST halls (Unity/Conti, University/Katanga, Republic, Queen Elizabeth II, Independence, Africa) and student hostels across Ayeduase, Kotei, Bomso, Boadi, and Gaza."
				}
			},
			{
				"@type": "Question",
				name: "Which areas in Kumasi do you cover for laundry pickup?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We cover KNUST campus, Ayeduase, Kotei, Bomso, Boadi, Oforikrom, Gyinyase, Kentinkrono, and surrounding Kumasi neighborhoods."
				}
			},
			{
				"@type": "Question",
				name: "How do I pay for my laundry service?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "You only pay after your clothes are cleaned, ironed, and returned to your hands. We accept Mobile Money (MTN MoMo, Telecel Cash) and cash directly on delivery."
				}
			},
			{
				"@type": "Question",
				name: "What items and garments do you wash and fold?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We wash all everyday student and household clothing including shirts, trousers, jeans, dresses, hoodies, bedsheets, duvet covers, lab coats, and native wear with gentle fabric care."
				}
			}
		]
	}]
};
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en-GH",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 258,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(schemaData) }
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 259,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 257,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 266,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 264,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 256,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$1.useRouteContext();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").then((reg) => {
				console.debug("Service Worker registered for Web Push background notifications:", reg.scope);
			}).catch((err) => {
				console.debug("Service Worker registration notice:", err);
			});
			const handleInputBlur = (e) => {
				if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) window.scrollTo({
					left: 0,
					top: window.scrollY,
					behavior: "instant"
				});
			};
			document.addEventListener("blur", handleInputBlur, true);
			return () => {
				document.removeEventListener("blur", handleInputBlur, true);
			};
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 315,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster$1, {
			position: "top-center",
			richColors: true
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 316,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 313,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 312,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter = () => import("./routes-BwhC8Pzr.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
			{
				name: "description",
				content: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast."
			},
			{
				name: "robots",
				content: "index, follow"
			},
			{
				property: "og:site_name",
				content: "Affordable Laundry"
			},
			{
				property: "og:locale",
				content: "en_GH"
			},
			{
				property: "og:url",
				content: "https://affordable-laundry.vercel.app/"
			},
			{
				property: "og:title",
				content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery"
			},
			{
				property: "og:description",
				content: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: "https://affordable-laundry.vercel.app/og-image.jpg"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery"
			},
			{
				name: "twitter:description",
				content: "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast."
			},
			{
				name: "twitter:image",
				content: "https://affordable-laundry.vercel.app/og-image.jpg"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://affordable-laundry.vercel.app/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
}).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 3e5,
		gcTime: 18e5,
		refetchOnWindowFocus: false
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
