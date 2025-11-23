import { onAuthReady } from "./authentication.js"
import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

function initAuthUI() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "loginSignup.html";
      return;
    } else {
        recyclingTracker.style.display = "block";
    }
  });

  recyclingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser

    let badgeMap = {
      "Paper/Cardboard": "lumberjack",
      "Containers": "cargo",
      "Glass": "fragile",
      "Foam Packaging": "esoteric",
      "Electronics": "electric",
      "Scrap Metal": "scrappy",
      "Flexible Plastics": "polymer",
      "Other": "esoteric"
    }

    const checkedInputs = [...document.querySelectorAll("#recyclingForm input[type='checkbox']:checked")];

    if (checkedInputs.length === 0) {
      feedbackBanner.innerText = "Please check at least one box."
      feedbackBanner.classList.remove("hidden")
      return;
    }

    try {
      feedbackBanner.classList.add("hidden");
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User document not found.");
        return;
      }

      let badges = userDoc.data().badges || {
        cargo: 0,
        electric: 0,
        esoteric: 0,
        fragile: 0,
        green: 0,
        lumberjack: 0,
        polymer: 0,
        scrappy: 0
      };

      badges.green += 1
      
      checkedInputs.forEach(input => {
        const badgeKey = badgeMap[input.name]
        if (badgeKey) badges[badgeKey] += 1
      })
      
      await setDoc(userRef, {badges}, {merge: true})

      window.location.href = "/src/pages/badge.html";
    } catch (error) {
        console.error("Error updating badges", error)

        feedbackBanner.textContent = "We couldn't update your profile. Please try again.";
        feedbackBanner.classList.remove("hidden");
        feedbackBanner.classList.add("text-[#bc4749]");

        checkedInputs.forEach(input => input.checked = false);
    }
  })
}

document.addEventListener('DOMContentLoaded', initAuthUI);
