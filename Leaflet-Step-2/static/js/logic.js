url = "https://raw.githubusercontent.com/mattdhill011/leaflet-challenge/main/Leaflet-Step-2/all_month.geojson"
plateUrl = "https://raw.githubusercontent.com/mattdhill011/leaflet-challenge/main/Leaflet-Step-2/PB2002_boundaries.json"

d3.json(url).then(function(earthquakes) {

    // All of this is the same from the Leaflet-Step-2 javascript file
    var earthquakeLayer = new L.layerGroup();

    for (var i =0; i < earthquakes.features.length; i++) {

        var color = "";

        var coord = [earthquakes.features[i].geometry.coordinates[1], earthquakes.features[i].geometry.coordinates[0]]
        var mag = earthquakes.features[i].properties.mag
        var depth = earthquakes.features[i].geometry.coordinates[2]
        var date = new Date(earthquakes.features[i].properties.time)

        if (depth <= 10) {
            color = '#2aa10f';
        } else if (depth <= 30) {
            color = '#92e000';
        } else if (depth <= 50) {
            color = '#e1ff00';
        } else if (depth <= 70) {
            color = '#f58b00';
        } else if (depth <=90) {
            color = '#de3700';
        } else {
            color = '#b30000';
        };


        L.circle(coord, {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: mag * 20000
        }).bindPopup(`
            <h2>${earthquakes.features[i].properties.place}</h2>
            <p>Magnitude: ${mag}<br>
            Depth: ${depth} km<br>
            Time Recorded: ${date}</p>
        `).addTo(earthquakeLayer)
    }

    // Now we create a new layer for the plate boundries
    var plateBoundryLayer = new L.layerGroup();

    d3.json(plateUrl).then(function(plateBoundry) {

        // Leaflet still needs the coordinates reversed from the json, so we make this function to take care of that for us
        function reverseCoords(coords) {
            return [coords[1], coords[0]];
        };

        // Loop through the geometry of each plate
        for (var i = 0; i < plateBoundry.features.length; i++) {
            var plateCoord = plateBoundry.features[i].geometry.coordinates;

            // This variable is going to store the list of coordinates that mark the boundry of each plate, but first we have to reverse them
            var reversedCoord = [];

            for (var j = 0; j < plateCoord.length; j++) {
                reversedCoord.push(reverseCoords(plateCoord[j]));
            };

            // Finally we make a polyline object (polygon was giving me trouble) to mark the plate boundries
            L.polyline(reversedCoord).addTo(plateBoundryLayer);
        };
    });
    
    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // We also add two more layers, a satellite map and topographic
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Now we need two different sets of layers, one for the base maps and another for the overlays
    var baseMaps = {
        "OpenStreetMap": streetmap,
        "Google satellite": googleSat,
        "Topographic":topo
    };

    var overlayMaps = {
        "Earthquakes": earthquakeLayer,
        "Plate Boundries": plateBoundryLayer
    };   

    var map = L.map("map", {
        center: [0,0],
        zoom: 3,
        layers: [streetmap, googleSat, topo, earthquakeLayer, plateBoundryLayer]

    });

    // Same as part-1 we create the legend
    function getColor(m) {
        return m <= 10 ? '#2aa10f':
        m <= 30 ? '#92e000':
        m <= 50 ? '#e1ff00':
        m <= 70 ? '#f58b00':
        m <=90 ? '#de3700':
        '#b30000';
}

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = ['-10', '10', '30', '50', '70', '90'];

        div.innerHTML += "Earthquake Depth" + '<br>'
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);

    // Now we add controls for selecting the layers
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

});


