import { auth, db } from "/src/firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";


// Logs an existing user into Firebase Authentication.
export async function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}


// Creates a new user account with Firebase Authentication, then updates the user's profile with a display name.
export async function signupUser(username, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // Get user object
    await updateProfile(userCredential.user, { displayName: username });

    try {
        await setDoc(doc(db, "users", user.uid), {
            userID: user.uid,
            username: username,
            email: email,
            bio: "",
            photoURL: "",
            exp: 0,
            lvl: 0,
            badges: {            
            green: 0,
            lumberjack: 0, 
            polymer: 0, 
            scrappy: 0, 
            esoteric: 0, 
            fragile: 0, 
            cargo: 0, 
            electric: 0,},
        });
        console.log("User added to Firestore.");
    } catch (error) {
        console.error("Error creating user document in Firestore:", error)
    }
    return userCredential.user;
}


// Signs out the currently logged-in user and redirects them back to the login page (index.html).
export async function logoutUser() {
    await signOut(auth);
    window.location.href = "/index.html";
}


// Observes changes in the user's authentication state (login/logout) and updates the UI or redirects accordingly.
export function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (window.location.pathname.endsWith("main.html")) {
            if (user) {
                const displayName = user.displayName || user.email;
                $("#welcomeMessage").text(`Hello, ${displayName}!`);
            } else {
                window.location.href = "index.html";
            }
        }
    });
}


// Runs the given callback(user) when Firebase resolves or changes auth state.
// Useful for showing user info or redirecting after login/logout.
export function onAuthReady(callback) {
    return onAuthStateChanged(auth, callback);
}


// Maps Firebase Auth error codes to short, user-friendly messages.
// Helps display clean error alerts instead of raw Firebase codes.
export function authErrorMessage(error) {
    const code = (error?.code || "").toLowerCase();

    const map = {
        "auth/invalid-credential": "Wrong email or password.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account found with that email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/email-already-in-use": "Email is already in use.",
        "auth/weak-password": "Password too weak (min 6 characters).",
        "auth/missing-password": "Password cannot be empty.",
        "auth/network-request-failed": "Network error. Try again.",
    };

    return map[code] || "Something went wrong. Please try again.";
}


// Enables user to sign in with Google account via pop-up
export async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("Google user:", user.displayName, user.email)
        window.location.href = "/profile.html"
    } catch (error) {
        console.error("Google sign-in failed:", error);
        alert("Google sign-in failed. Please try again.")
    }
}
