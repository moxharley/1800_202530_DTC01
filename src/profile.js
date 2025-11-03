import { onAuthReady } from "./authentication.js"
import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";


// Read data from logged-in-user's collection in db and display their username, bio, and profile picture
function showUserInfo() {
    const usernameElement = document.getElementById("usernameElement")
    const bioElement = document.getElementById("bioElement")
    const profilePictureElement = document.getElementById("profilePictureElement")

    onAuthReady(async (user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists) {
            const data = userDoc.data();

            const username = data.username || data.email
            const bio = data.bio || "";
            const profilePictureURL = data.photoURL || "/images/placeholder_avatar.png"
            
            if (usernameElement) {
                usernameElement.textContent = `${username}`
            }
    
            if (bioElement) {
                bioElement.textContent = `${bio}`
            }
    
            if (profilePictureElement) {
                profilePictureElement.src = `${profilePictureURL}`
            }
        }
            
    });
}


showUserInfo();