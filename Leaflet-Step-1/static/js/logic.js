url = "https://raw.githubusercontent.com/mattdhill011/leaflet-challenge/main/Leaflet-Step-1/all_month.geojson"
plateUrl = "https://raw.githubusercontent.com/mattdhill011/leaflet-challenge/main/Leaflet-Step-1/PB2002_boundaries.json"

d3.json(url).then(function(earthquakes) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var map = L.map("map", {
        center: [0,0],
        zoom: 3,
        layers: [streetmap]

    });

    for (var i =0; i < earthquakes.features.length; i++) {

        var color = "";

        var coord = [earthquakes.features[i].geometry.coordinates[1], earthquakes.features[i].geometry.coordinates[0]]
        var mag = earthquakes.features[i].properties.mag
        var depth = earthquakes.features[i].geometry.coordinates[2]
        var date = new Date(earthquakes.features[i].properties.time)

        if (depth <= 10) {
            color = '#fef0d9';
        } else if (depth <= 30) {
            color = '#fdd49e';
        } else if (depth <= 50) {
            color = '#fdbb84';
        } else if (depth <= 70) {
            color = '#fc8d59';
        } else if (depth <=90) {
            color = '#e34a33';
        } else {
            color = '#b30000';
        };

        L.circle(coord, {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            radius: mag * 20000
        }).bindPopup(`
            <h2>${earthquakes.features[i].properties.place}</h2>
            <p>Magnitude: ${mag}<br>
            Depth: ${depth} km<br>
            Time Recorded: ${date}</p>
        `).addTo(map);
    }

    d3.json(plateUrl).then(function(plateBoundry) {
        for (var i = 0; i < plateBoundry.features.length; i++) {
            var plateCoord = plateBoundry.features[i].geometry.coordinates;
            console.log(plateCoord);
            var reversedCoord = [];
            for (var j = 0; j < plateCoord.length; i++) {
                reversedCoord.push([plateCoord[j][1], plateCoord[j][0]]);
            };
            L.polygon(reversedCoord, {
                color:"black"
            }).addTo(map);
        }
    });


});


