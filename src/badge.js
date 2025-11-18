import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

//0 - Not Unlocked
//1 - Bronze
//2 - Silver
//3 - Gold
//4 - Platinum

function updateBadgeIcon(level, htmlID) {
    const badgeElement = document.getElementById(htmlID);
    const img = badgeElement.querySelector("img");

    if (level === 0) return;

    let badgeStatus = 0;
    if (level >= 40){
        badgeStatus = 4;
    }
    else if (level >= 20){
        badgeStatus = 3;
    }
    else if (level >= 10){
        badgeStatus = 2;
    }
    else {
        badgeStatus = 1;
    }

    const map = {
        1: "/images/logo-bronze.png",
        2: "/images/logo-silver.png",
        3: "/images/logo-gold.png",
        4: "/images/logo-platinum.png"
    };

    img.src = map[badgeStatus];
}


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

    updateBadgeIcon(greenRef, "green");
    updateBadgeIcon(lumberjackRef, "lumberjack");
    updateBadgeIcon(polymerRef, "polymer");
    updateBadgeIcon(fragileRef, "fragile");
    updateBadgeIcon(scrappyRef, "scrappy");
    updateBadgeIcon(electricRef, "electric");
    updateBadgeIcon(cargoRef, "cargo");
    updateBadgeIcon(esotericRef, "esoteric");

    if (greenRef < 5) {
        document.getElementById('green').classList.toggle('grayscale')
        document.getElementById('green').classList.toggle('brightness-[50%]')
    }
    if (lumberjackRef < 5) {
        document.getElementById('lumberjack').classList.toggle('grayscale')
        document.getElementById('lumberjack').classList.toggle('brightness-[50%]')
    }
    if (polymerRef < 5) {
        document.getElementById('polymer').classList.toggle('grayscale')
        document.getElementById('polymer').classList.toggle('brightness-[50%]')
    }
    if (fragileRef < 5) {
        document.getElementById('fragile').classList.toggle('grayscale')
        document.getElementById('fragile').classList.toggle('brightness-[50%]')
    }
    if (scrappyRef < 5) {
        document.getElementById('scrappy').classList.toggle('grayscale')
        document.getElementById('scrappy').classList.toggle('brightness-[50%]')
    }
    if (electricRef < 5) {
        document.getElementById('electric').classList.toggle('grayscale')
        document.getElementById('electric').classList.toggle('brightness-[50%]')
    }
    if (cargoRef < 5) {
        document.getElementById('cargo').classList.toggle('grayscale')
        document.getElementById('cargo').classList.toggle('brightness-[50%]')
    }
    if (esotericRef < 5) {
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
