url = "https://raw.githubusercontent.com/mattdhill011/leaflet-challenge/main/Leaflet-Step-1/all_month.geojson"

d3.json(url).then(function(earthquakes) {


    // Create a new layergroup to hold the data for the earthquakes
    var earthquakeLayer = new L.layerGroup();

    // Loop through the json file
    for (var i =0; i < earthquakes.features.length; i++) {        

        // Set up a variable to hold the coordinates, leaflet needs the coordinates reversed from how they are saved on the json file
        var coord = [earthquakes.features[i].geometry.coordinates[1], earthquakes.features[i].geometry.coordinates[0]]
        var mag = earthquakes.features[i].properties.mag
        var depth = earthquakes.features[i].geometry.coordinates[2]

        // The json files keeps the date as a timestamp, so we use the date function to turn it into a readable date
        var date = new Date(earthquakes.features[i].properties.time)

        var color = "";

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

        // Now we add a circle to our layer with a radius proportional to the magnitide and color based on the depth, with a popup with details for each earthquake
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

        
    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });  

    var map = L.map("map", {
        center: [0,0],
        zoom: 3,
        layers: [streetmap, earthquakeLayer]

    });


    // Here we make our legend, first using this function to get the color that cooresponds to depth
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

    // Now add it to the map
    legend.addTo(map);
});


