const REFUGE_API_URL = "https://www.refugerestrooms.org/api/v1/restrooms";
let map;
let startingPosition = { lat: 34.0549, lng: -118.2426 };

// Initialize Google Map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: startingPosition,
        zoom: 12,
    });
}

// Fetch bathrooms by latitude and longitude
async function fetchBathrooms(lat, lng, numResults = 10) {
    try {
        const response = await fetch(`${REFUGE_API_URL}/by_location?lat=${lat}&lng=${lng}&per_page=${numResults}`);
        const bathrooms = await response.json();
        displayBathrooms(bathrooms);
    } catch (error) {
        console.error("Error fetching bathrooms:", error);
    }
}

// Display bathrooms as markers on the map
function displayBathrooms(bathrooms) {
    const resultsList = document.getElementById("results").querySelector("ul");
    resultsList.innerHTML = ""; // Clear previous results

    bathrooms.forEach(bathroom => {
        const lat = bathroom.latitude;
        const lng = bathroom.longitude;

        // Create marker
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: bathroom.name
        });

        // Add info window to each marker
        const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${bathroom.name}</h3><p>${bathroom.street}, ${bathroom.city}</p><p>Unisex: ${bathroom.unisex ? "Yes" : "No"}</p>`
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        // Append location to results list
        const listItem = document.createElement("li");
        listItem.textContent = `${bathroom.name} - ${bathroom.street}, ${bathroom.city}`;
        resultsList.appendChild(listItem);
    });
}

// Geocode address and fetch bathrooms at location
async function fetchBathroomsByAddress(address) {
    try {
        // Use the Google Geocoding API to convert address to coordinates
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyBKVO0gLbjKvibOm6rxkhG23abD2DbeRm0`);
        const data = await response.json();

        if (data.status === "OK") {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            fetchBathrooms(lat, lng); // Fetch and display bathrooms at the geocoded location
            map.panTo({ lat, lng });
        } else {
            alert("Location not found. Please try another address.");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
    }
}

// Event listener for "Search Near Me" button with detailed error handling
document.getElementById("near-me-btn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            fetchBathrooms(lat, lng); // Fetch bathrooms near user's location
            map.panTo({ lat, lng });
        },
        (error) => {
            // Detailed error logging
            console.error(`Error getting location: ${error.message} (Code: ${error.code})`);
            switch (error.code) {
                case 1:
                    alert("Permission denied. Please allow location access.");
                    break;
                case 2:
                    alert("Position unavailable. Check your internet connection or try again later.");
                    break;
                case 3:
                    alert("Location request timed out. Please try again.");
                    break;
                default:
                    alert("Unable to retrieve location. Please try searching by address.");
            }
        }
    );
});

// Event listener for "Search by Address" button
document.getElementById("address-search-btn").addEventListener("click", () => {
    const address = document.getElementById("address-input").value;
    if (address) {
        fetchBathroomsByAddress(address); // Fetch bathrooms by the entered address
    } else {
        alert("Please enter an address.");
    }
});

// Initialize map on load
initMap();
