// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize all the LayerGroups that we'll use.
var layers = {
    earthquakeLayer: new L.LayerGroup()
};

var map = L.map("map", {
    center: [0,0],
    zoom: 3,
    layers: [
        layers.earthquakeLayer
    ]
});

streetmap.addTo(map)

var overlays = {
    "Earthquakes": layers.earthquakeLayer
}