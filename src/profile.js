import { onAuthReady } from "./authentication.js"
import { auth, db, storage } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function initAuthUI() {
    const toEditProfile = document.getElementById('toEditProfile');
    const profileView = document.getElementById('profileView');
    const editProfileView = document.getElementById('editProfileView');

    // Toggle element visibility
    function setVisible(el, visible) {
        el.classList.toggle('hidden', !visible);
    }

    // Toggle update profile
    toEditProfile?.addEventListener('click', (e) => {
        e.preventDefault();
        setVisible(profileView, false);
        setVisible(editProfileView, true);
        signupView?.querySelector('input')?.focus();
    });


    // Read data from logged-in-user's collection in db and display their username, bio, and profile picture
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


    // Edit User Profile
    const photoInput = document.getElementById("photoInput")
    const bioInput = document.getElementById("bioInput")
    const saveProfileBtn = document.getElementById("saveProfileBtn")
    const userProfileSection = document.getElementById("userProfileSection")

    saveProfileBtn.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) window.location.href = "/src/pages/loginSignup.html"

        const userDoc = doc(db, "users", user.uid);

        try {
            let photoURL;

            // Upload selected file to Firebase Storage
            if (photoInput.files[0]) {
                const file = photoInput.files[0];
                const storageRef = ref(storage, `profilePictures/${user.uid}`)
                await uploadBytes(storageRef, file);
                photoURL = await getDownloadURL(storageRef)
            }

            await updateDoc(
                userDoc,
                {
                    bio: bioInput.value,
                    photoURL: photoURL
                }
            )
            
            setVisible(editProfileView, false);
            setVisible(profileView, true);
            userProfileSection.append("Profile successfully updated.")
        } catch (error) {
            console.error("Error updating profile", error)
            userProfileSection.append("Something went wrong while updating your profile. Please try again later.")
        }
    })
}




document.addEventListener('DOMContentLoaded', initAuthUI);