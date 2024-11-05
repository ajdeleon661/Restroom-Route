let map;
let startingPosition = { lat: 34.0549, lng: -118.2426 };
const REFUGE_RESTROOMS_URL = "https://www.refugerestrooms.org/api/v1/restrooms";
let markers = [];

// Initialize Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: startingPosition,
        zoom: 12,
    });
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setCenter({ lat, lng });
            fetchCurrentRestrooms(lat, lng,);
        }
    );
}

async function fetchCurrentRestrooms(lat, lng, numResults = 5) {
    try {
        const response = await fetch(`${REFUGE_RESTROOMS_URL}/by_location?lat=${lat}&lng=${lng}&per_page=${numResults}`);
        const restrooms = await response.json();
        displayRestrooms(restrooms);
    } catch (error) {
        console.error("Error fetching restrooms:", error);
    }
}

// Display Restrooms as Markers on the Map
function displayRestrooms(restrooms) {
    const resultsList = document.getElementById("results").querySelector("ul");
    resultsList.innerHTML = "";
    saveSearchResults(restrooms);

    restrooms.forEach(restroom => {
        const lat = restroom.latitude;
        const lng = restroom.longitude;

        // Create marker
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: restroom.name,
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${restroom.name}</h3><p>${restroom.street}, ${restroom.city}</p>`,
        });
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

    // Append location to results list
        const listItem = document.createElement("li");
        listItem.textContent = `${bathroom.name} - ${bathroom.street}, ${bathroom.city}, ${bathroom.distance.toFixed(2)} miles`;
        resultsList.appendChild(listItem);
    });
}

    // Geocode address and fetch restrooms at location
async function fetchRestroomsByLocation(location) {
    try {
        // Google Geocoding API to convert address to coordinates
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyBKVO0gLbjKvibOm6rxkhG23abD2DbeRm0`);
        const data = await response.json();

        if (data.status === "OK") {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            fetchCurrentRestrooms(lat, lng); // Fetch and display bathrooms at the geocoded location
            map.panTo({ lat, lng });
        } else {
            alert("Location not found. Please try another address.");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
    }
}

// Event listener for "Search" button
document.getElementById("location-search-btn").addEventListener("click", () => {
    const location = document.getElementById("location-input").value;
    if (location) {
        fetchRestroomsByLocation(location); // Fetch bathrooms by the entered address
    } else {
        alert("Please enter a Location.");
    }
});

// Save search results to local storage
function saveSearchResults(restrooms) {
    localStorage.setItem("restrooms", JSON.stringify(restrooms));
}

function loadSavedResults() {
    const savedResults = localStorage.getItem("restrooms");
    if (savedResults) {
        const restrooms = JSON.parse(savedResults);
        displayRestrooms(restrooms);
    }
}