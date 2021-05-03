const fs = require("fs");

const leg1 = require("../data-scripts/output/geojson_leg1.json");
const leg2 = require("../data-scripts/output/geojson_leg2.json");
const leg3 = require("../data-scripts/output/geojson_leg3.json");
const leg4 = require("../data-scripts/output/geojson_leg4.json");
const leg5 = require("../data-scripts/output/geojson_leg5.json");

const geoJson = {
  type: "LineString",
  coordinates: [
    ...leg1.coordinates,
    ...leg2.coordinates,
    ...leg3.coordinates,
    ...leg4.coordinates,
    ...leg5.coordinates,
  ],
};

fs.writeFileSync(
  "./data-scripts/output/combined.json",
  JSON.stringify(geoJson)
);
