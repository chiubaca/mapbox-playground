const data = require("./output/gmaps_leg3");
var polyline = require("@mapbox/polyline");
const fs = require("fs");

const result = polyline.toGeoJSON(data.routes[0].overview_polyline.points);

console.log("Converted to geojson", result);
fs.writeFileSync(
  "./data-scripts/output/geojson_leg3.json",
  JSON.stringify(result)
);
