import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { ref } from "firebase/database";

//0 - Not Unlocked
//1 - Bronze
//2 - Silver
//3 - Gold
//4 - Platinum

async function toggleBadges() {

    const greenRef = 1
    const lumberjackRef = 1
    const polymerRef = 0
    const fragileRef = 0
    const scrappyRef = 0
    const electricRef = 0
    const thriftyRef = 0
    const esotericRef = 0

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
    if (thriftyRef === 0) {
        document.getElementById('thrifty').classList.toggle('grayscale')
        document.getElementById('thrifty').classList.toggle('brightness-[50%]')
    }
    if (esotericRef === 0) {
        document.getElementById('esoteric').classList.toggle('grayscale')
        document.getElementById('esoteric').classList.toggle('brightness-[50%]')
    }
}
toggleBadges();