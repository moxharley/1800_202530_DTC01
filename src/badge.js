import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

//0 - Not Unlocked
//1 - Bronze
//2 - Silver
//3 - Gold
//4 - Platinum

async function toggleBadges(user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    const greenRef = userDoc.data().badges.green;
    const lumberjackRef = userDoc.data().badges.lumberjack;
    const polymerRef = userDoc.data().badges.polymer;
    const fragileRef = userDoc.data().badges.fragile;
    const scrappyRef = userDoc.data().badges.scrappy;
    const electricRef = userDoc.data().badges.electric;
    const cargoRef = userDoc.data().badges.cargo;
    const esotericRef = userDoc.data().badges.esoteric;

    console.log(greenRef)

    if (greenRef === 0) {
        document.getElementById('green').classList.toggle('grayscale')
        document.getElementById('green').classList.toggle('brightness-[50%]')
    }
    if (lumberjackRef === 0) {
        document.getElementById('lumberjack').classList.toggle('grayscale')
        document.getElementById('lumberjack').classList.toggle('brightness-[50%]')
    }
    if (polymerRef === 0) {
        document.getElementById('polymer').classList.toggle('grayscale')
        document.getElementById('polymer').classList.toggle('brightness-[50%]')
    }
    if (fragileRef === 0) {
        document.getElementById('fragile').classList.toggle('grayscale')
        document.getElementById('fragile').classList.toggle('brightness-[50%]')
    }
    if (scrappyRef === 0) {
        document.getElementById('scrappy').classList.toggle('grayscale')
        document.getElementById('scrappy').classList.toggle('brightness-[50%]')
    }
    if (electricRef === 0) {
        document.getElementById('electric').classList.toggle('grayscale')
        document.getElementById('electric').classList.toggle('brightness-[50%]')
    }
    if (cargoRef === 0) {
        document.getElementById('cargo').classList.toggle('grayscale')
        document.getElementById('cargo').classList.toggle('brightness-[50%]')
    }
    if (esotericRef === 0) {
        document.getElementById('esoteric').classList.toggle('grayscale')
        document.getElementById('esoteric').classList.toggle('brightness-[50%]')
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        toggleBadges(user);
    } 
    else {
        console.log('User = Null')
    }
});
