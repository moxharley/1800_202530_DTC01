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
        name: "ABC Recycling",
        city: "Burnaby",
        address: "8081 Meadow Avenue",
        phone: "604-522-9727",
        lat: 49.2166,
        lng: -123.0123,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Burnaby Eco-Centre",
        city: "Burnaby",
        address: "4855 Still Creek",
        lat: 49.2775,
        lng: -122.9981,
        phone: "604-294-7972",
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Regional Recycling",
        city: "Burnaby",
        address: "2876 Norland Ave",
        phone: "1-855-701-7171",
        lat: 49.2294,
        lng: -122.9392,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "United Boulevard Recycling and Waste Centre",
        city: "Coquitlam",
        address: "995 United Blvd",
        phone: "604-681-5600",
        lat: 49.283,
        lng: -122.753,
        accepts: [
            "scrap_metal",
            "paper_and_cardboard"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Urban Impact",
        city: "New Westminster",
        address: "5 Capilano Way",
        phone: "604-273-0089",
        lat: 49.2243,
        lng: -122.8831,
        accepts: [
            "paper_and_cardboard",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Emterra Environmental",
        city: "North Vancouver",
        address: "132 Riverside Drive",
        phone: "604-929-7377",
        lat: 49.319343,
        lng: -123.011467,
        accepts: [
            "paper_and_cardboard",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "North Shore Recycling and Waste Centre",
        city: "North Vancouver",
        address: "30 Riverside Drive",
        phone: "604-929-5471",
        lat: 49.3015,
        lng: -123.0204,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Allied Salvage & Metals (1985) Ltd.",
        city: "Richmond",
        address: "11651 Twigg Place",
        phone: "604-322-6629",
        lat: 49.2030558,
        lng: -123.0943925,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "City of Richmond Recycling Depot",
        city: "Richmond",
        address: "5555 Lynas Lane",
        phone: "604-276-4010",
        lat: 49.1665898,
        lng: -123.133569,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Ecowaste Industries",
        city: "Richmond",
        address: "15111 Williams Rd",
        phone: "604-277-1410",
        lat: 49.1510311,
        lng: -123.0723501,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Eagle Disposal Inc.",
        city: "Richmond",
        address: "11611 Twigg Place",
        phone: "604-821-2025",
        lat: 49.2022581,
        lng: -123.0913062,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Inner City Demolition",
        city: "Richmond",
        address: "11640 Twigg Place",
        phone: "604-327-0957",
        lat: 49.1198,
        lng: -123.1058,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Regional Recycling",
        city: "Richmond",
        address: "13300 Vulcan Way",
        phone: " 1-855-701-7171",
        lat: 49.1957873,
        lng: -123.0808515,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Richmond Steel Recycling Ltd.",
        city: "Richmond",
        address: "11760 Mitchell Road",
        phone: "604-324-4656",
        lat: 49.2015229,
        lng: -123.0906664,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Richvan Holdings Ltd.",
        city: "Richmond",
        address: "15300 River Road",
        phone: "604-270-8922",
        lat: 49.2016948,
        lng: -123.0567034,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Southernstar Enterprises Inc.",
        city: "Richmond",
        address: "8501 Ontario Street",
        phone: "604-285-3200",
        lat: 49.2069776,
        lng: -123.1097778,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Capital Salvage",
        city: "Vancouver",
        address: "1919 Triumph Street",
        phone: "604-253-8481",
        lat: 49.2841937,
        lng: -123.0675897,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Davis Trading and Supply Ltd.",
        city: "Vancouver",
        address: "1100 Grant Street",
        phone: "604-255-3111",
        lat: 49.2712096,
        lng: -123.0815806,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Emterra Environmental ",
        city: "Vancouver",
        address: "955 West Kent Avenue",
        phone: "604-327-7647",
        lat: 49.2037022,
        lng: -123.1323492,
        accepts: [
            "paper_and_cardboard",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "North Star Metal Recycling",
        city: "Vancouver",
        address: "1170 Powell Street",
        phone: "604-254-2734",
        lat: 49.2827369,
        lng: -123.0819896,
        accepts: [
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Vancouver Zero Waste Centre",
        city: "Vancouver",
        address: "8588 Yukon Street",
        phone: "604-873-7000",
        lat: 49.2084957,
        lng: -123.1175894,
        accepts: [
            "paper_and_cardboard",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Express & GO - UBC",
        city: "Vancouver",
        address: "2465 Health Sciences Mall",
        phone: "1855-350-2345",
        lat: 49.2610148,
        lng: -123.2455296,
        accepts: [
            "containers",
            "glass_containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Yaletown Return-It Express Depot",
        city: "Vancouver",
        address: "1387 Richards St",
        phone: "1855-350-2345",
        lat: 49.2741516,
        lng: -123.1271958,
        accepts: [
            "containers",
            "glass_containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Eazy Return - Vancouver Return-It Depot",
        city: "Vancouver",
        address: "2286 Ontario St",
        phone: "604-874-0367",
        lat: 49.2650445,
        lng: -123.1045253,
        accepts: [
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });


    addDoc(depotsRef, {
        name: "Powell Street Return-It Express Depot",
        city: "Vancouver",
        address: "1856 Powell St",
        phone: "604-253-4987",
        lat: 49.2710248,
        lng: -123.1293583,
        accepts: [
            "paper_and_cardboard",
            "soft_plastic",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Regional Recycling Vancouver Bottle Depot",
        city: "Vancouver",
        address: "960 Evans Ave, Vancouver",
        phone: "1-855-701-7171",
        lat: 49.2710248,
        lng: -123.1293583,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
            "scrap_metal"
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "United We Can Bottle Depot",
        city: "Vancouver",
        address: "449 Industrial Avenue",
        phone: "604-681-0001",
        lat: 49.2697001,
        lng: -123.0944459,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Mount Pleasant Return-It Depot",
        city: "Vancouver",
        address: "501 East Broadway",
        phone: "604-874-9223",
        lat: 49.2626802,
        lng: -123.0927701,
        accepts: [
            "soft_plastic",
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Vancouver West Return-It Depot",
        city: "Vancouver",
        address: "1253 West 75th Avenue",
        phone: "604-263-8809",
        lat: 49.2024731,
        lng: -123.1332891,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "South Van Bottle Depot",
        city: "Vancouver",
        address: "34 East 69th Avenue",
        phone: "604-325-3370",
        lat: 49.2088219,
        lng: -123.1063607,
        accepts: [
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Return-It Express & Go - Park Royal",
        city: "West Vancouver",
        address: "942 Park Royal S",
        phone: "1855-350-2345",
        lat: 49.3243167,
        lng: -123.1368378,
        accepts: [
            "containers",
            "glass_containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "North Shore Bottle Depot",
        city: "North Vancouver",
        address: "235 Donaghy Avenue",
        phone: "604-985-9348",
        lat: 49.3196055,
        lng: -123.0971719,
        accepts: [
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Return-It Express - LoLo",
        city: "North Vancouver",
        address: "101-370 E Esplanade",
        phone: "604-929-3825",
        lat: 49.3074715,
        lng: -123.0707159,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "North Vancouver Bottle & Return-It Depot",
        city: "North Vancouver",
        address: "310 Brooksbank Avenue",
        phone: "604-924-3889",
        lat: 49.3085943,
        lng: -123.0401755,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Return-It Express & Go - North Vancouver Superstore",
        city: "North Vancouver",
        address: "333 Seymour Blvd",
        phone: "1855-350-2345",
        lat: 49.3119053,
        lng: -123.0222912,
        accepts: [
            "containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Brentwood Return-It Depot",
        city: "Burnaby",
        address: "3931 Graveley Street",
        phone: "604-294-2827",
        lat: 49.2706299,
        lng: -123.017842,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Regional Recycling - Burnaby",
        city: "Burnaby",
        address: "2876 Norland Ave",
        phone: "1-855-701-7171",
        lat: 49.2583471,
        lng: -122.9780736,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Kensington Square Return-It",
        city: "Burnaby",
        address: "6518 Hastings Street",
        phone: "604-299-9779",
        lat: 49.2795678,
        lng: -122.9689442,
        accepts: [
            "containers",
            "glass_containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "East Hastings Bottle Depot",
        city: "Burnaby",
        address: "6893 Hastings Street",
        phone: "604-299-4254",
        lat: 49.2805663,
        lng: -122.9616342,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Collingwood Bottle Exchange",
        city: "Burnaby",
        address: "3805 Kingsway",
        phone: "778-896-0757",
        lat: 49.2327394,
        lng: -123.0197408,
        accepts: [
            "containers",
            "glass_containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Metrotown Return-It Depot",
        city: "Burnaby",
        address: "4760 Imperial Street",
        phone: "604-428-8820",
        lat: 49.2217652,
        lng: -122.9963962,
        accepts: [
            "soft_plastic",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Lee's Bottle Depot",
        city: "Burnaby",
        address: "7385 Buller Avenue",
        phone: "604-435-3432",
        lat: 49.216428,
        lng: -122.977993,
        accepts: [
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Edmonds Return-It Depot",
        city: "Burnaby",
        address: "7791 Kingsway",
        phone: "604-527-0466",
        lat: 49.2147846,
        lng: -122.9403921,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "OK Bottle Depot",
        city: "Richmond",
        address: "#145-5751 Cedarbridge Way",
        phone: "604-244-0008",
        lat: 49.173208,
        lng: -123.1426922,
        accepts: [
            "containers",
            "glass_containers",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Blundell Return-It Centre",
        city: "Richmond",
        address: "130-8180 No. 2 Road",
        phone: "604-274-1999",
        lat: 49.154088,
        lng: -123.1567788,
        accepts: [
            "containers",
            "glass_containers",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Ironwood Bottle Depot",
        city: "Richmond",
        address: "Unit 110 - 11020 Horseshoe Way",
        phone: "604-275-0585",
        lat: 49.130876,
        lng: -123.0927917,
        accepts: [
            "soft_plastic",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Return-It Depot - Queensborough Landing",
        city: "New Westminster",
        address: "409 Boyne St",
        phone: "604-540-4467",
        lat: 49.1935581,
        lng: -122.9413169,
        accepts: [
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
        ],
        last_updated: serverTimestamp()
    });

    addDoc(depotsRef, {
        name: "Vancouver Zero Waste Centre",
        city: "Vancouver",
        address: "8588 Yukon St",
        phone: "604-873-7000",
        lat: 49.2084749,
        lng: -123.1150065,
        accepts: [
            "paper_and_cardboard",
            "containers",
            "glass_containers",
            "foam_packaging",
            "electronics",
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
        firebaseQuery = query(depotsRef)
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
    const acceptsRaw = data.accepts.arrayValue.values || [];

    const accepts = acceptsRaw.map(item => {
        const str = item.stringValue;
        return str
            .replace(/_/g, " ")
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    });

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

function createInfoWindowContent({ name, address, phone, accepts }) {
    return `
        <div class="text-sm max-w-xs">
            <p class="text-[#386641] mb-1 font-semibold">${name}</p>
            <div class="text-[#386641] mb-1">${address}</div>
            ${phone ? `<span class="text-blue-600 hover:underline mb-1 block">${phone}</span>` : ""}

            ${`
                <div class="mb-2">
                    <span class="block text-gray-800 mb-1">Accepts:</span>
                    <div class="flex flex-wrap gap-1">
                        ${accepts.map(item => `<span class="bg-green-100 text-[#386641] text-xs px-2 py-1 rounded">${item}</span>`).join('')}
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
