let map;
let lat = 37.7749; // Starting latitude (e.g., San Francisco)
let lng = -122.4194; // Starting longitude (e.g., San Francisco)

async function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 13,
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });

    // Start auto-panning the map
    autoPanMap();
}

function autoPanMap() {
    setInterval(() => {
        lat += 0.0001; // Adjust for panning speed
        lng += 0.0001; // Adjust for diagonal movement
        map.setCenter({ lat, lng });
    }, 100); // Adjust interval speed for smoothness
}

