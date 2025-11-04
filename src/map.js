import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { db } from "./firebaseConfig"
import { doc, onSnapshot, getDoc, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

setOptions({
    key: apiKey,
    libraries: ["places", "maps"],
    version: "weekly",
});

async function initMap() {
    const { Map } = await importLibrary("maps");

    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
        console.error("#map not found");
        return;
    }

    const initialFocus = { lat: 49.283538582494636, lng: -123.11521188465825 }

    const map = new Map(mapContainer, {
        center: initialFocus,
        zoom: 12,
    });

    await loadDepots();
}

function addDepotsData() {
    const depotsRef = collection(db, "depots");
    console.log("Adding sample depot data...");
    addDoc(depotsRef, {
        name: "Mt Pleasant Return-It Depot", city: "Vancouver",
        address: "501 E Broadway, Vancouver",
        lat: 49.2638, lng: -123.0985,
        accepts: ["Beverage Containers", "Electronics", "Flexible Plastic Packaging", "Glass Packaging", "Paper Packaging", "Metal Packaging", "Rigid Plastic Packaging", "Printed Paper", "Small Appliances"],
        last_updated: serverTimestamp()
    });
    addDoc(depotsRef, {
        name: "Powell Street Return-It Depot", city: "Vancouver",
        address: "1856 Powell St, Vancouver",
        lat: 49.2831, lng: -123.0955,
        accepts: ["Beverage Containers", "Electronics", "Flexible Plastic Packaging", "Glass Packaging", "Paper Packaging", "Metal Packaging", "Rigid Plastic Packaging", "Printed Paper", "Small Appliances"],
        last_updated: serverTimestamp()
    });
    addDoc(depotsRef, {
        name: "North Shore Recycling and Waste Centre", city: "North Vancouver",
        address: "30 Riverside Dr W, North Vancouver",
        lat: 49.319343, lng: -123.011467,
        accepts: ["Beverage Containers", "Electronics", "Flexible Plastic Packaging", "Glass Packaging", "Paper Packaging", "Metal Packaging", "Rigid Plastic Packaging", "Printed Paper", "Small Appliances"],
        last_updated: serverTimestamp()
    });
}

async function seedDepots() {
    const depotsRef = collection(db, "depots");
    const querySnapshot = await getDocs(depotsRef);

    if (querySnapshot.empty) {
        console.log("Depots collection is empty. Seeding data...");
        addDepotsData();
    } else {
        console.log("Depots collection already contains data. Skipping seed.");
    }
}

async function loadDepots() {
    const depotsRef = collection(db, "depots");
    const querySnapshot = await getDocs(depotsRef);

    if (querySnapshot.empty) {
        console.warn("No depots found in Firestore.");
        return;
    } else {
        querySnapshot.forEach((depot) => {
            console.log("Depot data: ", depot.data)
        });
    }


}

seedDepots();
initMap().catch(err => {
    console.error("Error loading Google Maps:", err);
});
