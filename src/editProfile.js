import { onAuthReady } from "./authentication.js"
import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

function initAuthUI() {
    // Read data from logged-in-user's collection in db and display their username, bio, and profile picture
    const usernameInput = document.getElementById("usernameInput")
    const bioInput = document.getElementById("bioInput")
    const profilePictureElement = document.getElementById("profilePictureElement")
    const photoInput = document.getElementById("photoInput")
    const saveProfileBtn = document.getElementById("saveProfileBtn")
    const fileName = document.getElementById("fileName")

    onAuthReady(async (user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();

            const username = data.username || data.email
            const bio = data.bio || "";
            const profilePictureURL = data.photoURL || "/images/placeholder_avatar.png"

            if (usernameInput) {
                usernameInput.value = `${username}`
            }

            if (bioInput) {
                bioInput.value = `${bio}`
            }

            if (profilePictureElement) {
                profilePictureElement.src = `${profilePictureURL}`
            }
        }
    });

    // Give user feedback when they've uploaded a photo
    photoInput.addEventListener("change", () => {
        if (photoInput.files.length > 0) {
            fileName.textContent = photoInput.files[0].name;
        } else {
            fileName.textContent = "No file chosen"
        }
    })

    // Edit User Profile
    saveProfileBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) window.location.href = "/src/pages/loginSignup.html"

        try {
            let photoURL;

            // Convert uploaded file to Base64 before adding to firestore (avoids paying for Firebase Storage)
            if (photoInput.files[0]) {
                const file = photoInput.files[0];
                photoURL = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            }

            const updatingData = {
                username: usernameInput.value || "",
                bio: bioInput.value || ""
            };

            if (photoURL) {
            updatingData.photoURL = photoURL;
            }

            await setDoc(doc(db, "users", user.uid), updatingData, { merge: true });
            
            // Set success flag then redirect user to updated profile page
            sessionStorage.setItem("profileUpdated", "true");
            window.location.href = "/src/pages/profile.html";
        } catch (error) {
            console.error("Error updating profile", error)

            // Show error flag on top of form
            const feedbackBanner = document.getElementById("feedbackBanner");
            feedbackBanner.textContent = "We couldn't update your profile. Please try again.";
            feedbackBanner.classList.remove("hidden");
        }
    })
}


document.addEventListener('DOMContentLoaded', initAuthUI);