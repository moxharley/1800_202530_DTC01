import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { db } from "./firebaseConfig"
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let map;
let infoWindow;
let filter_form;
let markers = []
let AdvancedMarkerElement;

window.addEventListener("DOMContentLoaded", async () => {
    filter_form = document.getElementById("filter_form");

    await initMap();

    filter_form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const selectedFilters = getSelectedFilters();

        await loadDepots(selectedFilters);
    });
});

setOptions({
    key: apiKey,
    libraries: ["places", "maps"],
    version: "weekly",
});

async function initMap() {
    const { Map } = await importLibrary("maps");
    ({ AdvancedMarkerElement } = await importLibrary("marker"))

    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
        console.error("#map not found");
        return;
    }

    const defaultCenter = { lat: 49.283538582494636, lng: -123.11521188465825 }
    let mapCenter = defaultCenter

    try {
        mapCenter = await getUserLocation();
    } catch (err) {
        console.warn("Using default location:", err.message);
    }

    map = new Map(mapContainer, {
        center: mapCenter,
        zoom: 12,
        mapId: "depots_map"
    });

    const selectedFilters = getSelectedFilters();

    await loadDepots(selectedFilters);
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
        } else {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lng: longitude });
                },
                error => {
                    reject(error);
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
        }
    });
}


function addDepotsData() {
    const depotsRef = collection(db, "depots");
    console.log("Adding sample depot data...");

    addDoc(depotsRef, {
        name: "Mt Pleasant Return-It Depot",
        city: "Vancouver",
        address: "501 E Broadway, Vancouver",
        phone: "(604)-874-9223",
        lat: 49.2638,
        lng: -123.0985,
        accepts: [
            "soft_plastic",
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Powell Street Return-It Depot",
        city: "Vancouver",
        address: "1856 Powell St, Vancouver",
        lat: 49.2831,
        lng: -123.0955,
        phone: "(604) 253-4987",
        accepts: [
            "soft_plastic",
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "North Shore Recycling and Waste Centre",
        city: "North Vancouver",
        address: "30 Riverside Dr W, North Vancouver",
        phone: "(604) 681-5600",
        lat: 49.319343,
        lng: -123.011467,
        accepts: [
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });
}

async function seedDepots() {
    const depotsRef = collection(db, "depots");
    const querySnapshot = await getDocs(depotsRef);

    if (querySnapshot.empty) {
        console.log("Depots collection is empty. Seeding data...");
        addDepotsData();
    }
}

async function loadDepots(selectedFilters) {
    if (markers.length != 0) {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    const depotsRef = collection(db, "depots");
    let firebaseQuery;

    if (selectedFilters.length != 0) {
        firebaseQuery = query(depotsRef, where("accepts", "array-contains-any", selectedFilters));
    } else {
        return
    }
    const querySnapshot = await getDocs(firebaseQuery);

    infoWindow = new google.maps.InfoWindow();

    if (querySnapshot.empty) {
        console.warn("No depots found in Firestore.");
        return;
    } else {
        querySnapshot.forEach((depot) => {
            const newMarker = createDepotMarker(depot)
            markers.push(newMarker)
        });
    }
}

function createDepotMarker(depot) {
    const data = depot._document.data.value.mapValue.fields
    const name = data.name.stringValue
    const lat = data.lat.doubleValue
    const lng = data.lng.doubleValue
    const address = data.address.stringValue
    const phone = data.phone.stringValue
    const accepts = data.accepts.arrayValue.values

    const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat, lng },
        title: name
    })

    marker.addListener("click", () => {
        const infoWindowContent = createInfoWindowContent({ name, address, phone, accepts, lat, lng })
        infoWindow.setContent(infoWindowContent)
        infoWindow.open({ anchor: marker, map })
    })

    return marker;
}

function createInfoWindowContent({ name, address, phone, accepts, lat, lng }) {
    return `
        <div class="text-sm max-w-xs">
            <p class="text-[#386641] mb-1 font-semibold">${name}</p>
            <div class="text-[#386641] mb-1">${address}</div>
            ${phone ? `<span class="text-blue-600 hover:underline mb-1 block">${phone}</span>` : ""}

            ${`
                <div class="mb-2">
                    <span class="block text-gray-800 mb-1">Accepts:</span>
                    <div class="flex flex-wrap gap-1">
                        ${accepts.map(item => `<span class="bg-green-100 text-[#386641] text-xs px-2 py-1 rounded">${item.stringValue}</span>`).join('')}
                    </div>
                </div>
            `}

            <a href="https://www.google.com/maps/dir/?api=1&destination=${address}" target="_blank" class="text-blue-600 hover:underline block">
                Get Directions
            </a>
        </div>
    `;
}

function getSelectedFilters() {
    return Array.from(filter_form.querySelectorAll("input[type='checkbox']:checked")).map((input) => {
        return input.name
    })
}

seedDepots();
initMap().catch(err => {
    console.error("Error loading Google Maps:", err);
});
