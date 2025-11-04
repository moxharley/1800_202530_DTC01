import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

//Set badge to dim.
function setDimmed(element, dim) {
  element.classList.toggle("grayscale", dim);
  element.classList.toggle("brightness-[50%]", dim);
}

//Acquire the elements of the badge using a map (kinda like a dictionary in python).
function getBadgeElements() {
  //insert code here??
}

//Acquire user badge data.
async function fetchUserBadges(uid) {
  const snapshot = await getDocs(collection(db, "users", uid, "userStats", "badges"));
  const badges = {};
  snapshot.forEach(doc => {
    badges[doc.id] = doc.data()?.assigned ?? 0;
  });
  return badges;
}

//Apply the dimmed style when auth state changed.
onAuthStateChanged(auth, async (user) => {
  const badgeElements = getBadgeElements();

  //If you aren't signed in all are dimmed.
  if (!user) {
    badgeElements.forEach(element => setDimmed(element, true));
    return;
  }

  try {
    const badges = await fetchUserBadges(user.uid);
      // dim if unearned
    }
   catch (error) {
    console.error("Error loading badges:", error);
    badgeElements.forEach(element => setDimmed(element, true));
  }
});
