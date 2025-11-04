import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

function addBadgeData() {
    const badgeRef = collection(db, "users", uid, "badge");
    console.log("Adding sample badge data...");
    addDoc(badgeRef, {
        green: 0,
        lumberjack: 0, 
        polymer: 0, 
        scrappy: 0, 
        esoteric: 0, 
        fragile: 0, 
        thrifty: 0, 
        electric: 0,
        last_updated: serverTimestamp()
    });
}
//0 - Not Unlocked
//1 - Bronze
//2 - Silver
//3 - Gold
//4 - Platinum

async function seedUserBadges() {
    const badgeRef = collection(db, "hikes");
    const querySnapshot = await getDocs(badgeRef);

    if (querySnapshot.empty) {
        console.log("Badges collection is empty. Seeding data...");
        addBadgeData();
    } else {
        console.log("Badges collection already contains data. Skipping seed.");
    }
}
seedUserBadges();

function setDimmed(element, dim) {
  element.classList.toggle("grayscale", dim);
  element.classList.toggle("brightness-[50%]", dim);
}
