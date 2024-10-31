let map;
let startingPosition = { lat: 34.0549, lng: -118.2426};

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: startingPosition,
        zoom: 12,
    });
}
initMap();
