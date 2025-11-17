import { onAuthReady } from "./authentication.js"
import { db } from "./firebaseConfig.js";
import { collection, query, and, or, where, getDocs } from "firebase/firestore";

function initAuthUI() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "loginSignup.html";
      return;
    } else {
        recyclingForm.style.display = "block";
    }
  });
}

document.addEventListener('DOMContentLoaded', initAuthUI);
