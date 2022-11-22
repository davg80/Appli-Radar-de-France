// Initialize leaflet.js
var L = require('leaflet');
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/radars.csv', 'utf8');

// console.log(html);

function csvJSON(csv) {
    const lines = csv.split('\n')
    const result = []
    const headers = lines[0].split(',')

    for (let i = 1; i < lines.length; i++) {        
        if (!lines[i])
            continue
        const obj = {}
        const currentline = lines[i].split(',')

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j]
        }
        result.push(obj)
    }
    return result
}

// console.log(csvJSON(html));
const data = csvJSON(html);

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: false
});

data.forEach((radar) => {
    console.log(radar);
    L.marker([parseFloat(radar.latitude), parseFloat(radar.longitude)]).addTo(map);
})


// Set the position and zoom level of the map
map.setView([48, -1.7], 7);




// Initialize the base layer
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);