let map;

async function initMap() {
    const position = {lat: 34.0549, lng: -118.2426};
    const {Map} = await google.maps.importLibrary("maps");
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map"), {
        center: position,
        zoom: 8,
        mapId: "Demo_Map_ID",
    });
     const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Position",
    });
}