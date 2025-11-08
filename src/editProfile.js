import { onAuthReady } from "./authentication.js"
import { auth, db, storage } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function initAuthUI() {
    // Read data from logged-in-user's collection in db and display their username, bio, and profile picture
    const usernameInput = document.getElementById("usernameInput")
    const bioInput = document.getElementById("bioInput")
    const profilePictureElement = document.getElementById("profilePictureElement")
    const photoInput = document.getElementById("photoInput")
    const saveProfileBtn = document.getElementById("saveProfileBtn")

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

    // Edit User Profile
    saveProfileBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) window.location.href = "/src/pages/loginSignup.html"

        try {
            let photoURL;

            // Upload selected file to Firebase Storage
            if (photoInput.files[0]) {
                const file = photoInput.files[0];
                const storageRef = ref(storage, `profilePictures/${user.uid}`)
                await uploadBytes(storageRef, file);
                photoURL = await getDownloadURL(storageRef)
            }

            await setDoc(
                doc(db, "users", user.uid),
                {
                    username: usernameInput.value || "",
                    bio: bioInput.value || "",
                    photoURL: photoURL || ""
                },
                { merge: true }
            )
            
            // Set success flag then redirect user to updated profile page
            sessionStorage.setItem("profileUpdated", "true");
            window.location.href = "/src/pages/profile.html";
        } catch (error) {
            console.error("Error updating profile", error)

            // Show error flag on top of form
            const feedbackBanner = document.getElementById("feedbackBanner");
            feedbackBanner.textContent = "There was an issue updating your profile. Please try again.";
            feedbackBanner.classList.remove("hidden");
            feedbackBanner.classList.add("error"); // style however you want
        }
    })
}


document.addEventListener('DOMContentLoaded', initAuthUI);