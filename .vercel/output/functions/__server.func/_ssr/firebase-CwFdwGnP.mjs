import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { r as getAuth, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { a as setLogLevel, i as initializeFirestore } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-CwFdwGnP.js
var firebase_applet_config_default = {
	projectId: "gen-lang-client-0010839257",
	appId: "1:784037553240:web:1548ebf8dc9b38fd07162d",
	apiKey: "AIzaSyAo7hYvxKTUG51Fu7FMxtJz7eH1VTP0X4Q",
	authDomain: "gen-lang-client-0010839257.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-appscreendesigne-8f99ab62-7d65-4c26-bd95-292417592eb7",
	storageBucket: "gen-lang-client-0010839257.firebasestorage.app",
	messagingSenderId: "784037553240",
	measurementId: "",
	oAuthClientId: "784037553240-7g0rhdumn74h6mtahab92iu5nll7cg3p.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
var app = getApps().length > 0 ? getApp() : initializeApp(firebase_applet_config_default);
setLogLevel("error");
var db = initializeFirestore(app, { experimentalForceLongPolling: true }, firebase_applet_config_default.firestoreDatabaseId);
var auth = getAuth(app);
var googleProvider = new GoogleAuthProvider();
var ADMIN_EMAIL = "affordablelaundry424@gmail.com";
//#endregion
export { googleProvider as i, auth as n, db as r, ADMIN_EMAIL as t };
