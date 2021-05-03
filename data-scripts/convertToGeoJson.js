const data = require("./output/leg1.json");
var polyline = require("@mapbox/polyline");
const fs = require("fs");

// console.log(data.routes[0].overview_polyline);

// const result = polyline.toGeoJSON(data.routes[0].overview_polyline.points);

console.log("Converted to geojson", typeof result);
fs.writeFileSync(
  "./data-scripts/output/geojson_export.json",
  JSON.stringify(result)
);
