// Initialize leaflet.js
var L = require("leaflet");
var fs = require("fs");
var html = fs.readFileSync(__dirname + "/adresses.csv", "utf8");

// console.log(html);
function csvJSON(csv) {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj = {};
    const currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

// Initialize the map
var map = L.map("map", {
  scrollWheelZoom: false,
});

// console.log(csvJSON(html));
const data = csvJSON(html);
// console.log(data);

// Mise en place des coordonnées
data.forEach(async (address, index) => {
  let urlQuery = address.Rue.replace(/ /g, "+");
  const dataJson = `https://api-adresse.data.gouv.fr/search/?q=${urlQuery}`;
  // console.log(dataJson);
  const coordinates = await fetchText(dataJson);
  data[index] = {
    ...data[index],
    latitude: coordinates[0],
    longitude: coordinates[1],
  };
  console.log(data[index].latitude);
  console.log(data[index].longitude);
  L.circle([data[index].latitude, data[index].longitude], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
  })
  .addTo(map);
  console.log(data);
});

// Set the position and zoom level of the map
map.setView([48, -1.7], 7);

// Initialize the base layer
var osm_mapnik = L.tileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

async function fetchText(url) {
  let response = await fetch(url);
  let data = await response.json();
  // console.log(data.features[0].geometry.coordinates);
  return data.features[0].geometry.coordinates;
}
