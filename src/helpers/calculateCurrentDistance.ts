import * as turf from "@turf/turf";
// import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import * as ldn_ktm_route from "../../geodata/ldn_ktm_line.json";

const LENGTH_OF_WALK_MILES = 4500;
const GEOJSON_LENGTH = 4553.481428163511; // precalculated with turf

const FAKE_CURRENT_DISTANCE_MILES = 1000;

export const currentDistance = () => {
  const route = turf.lineString([
    ...ldn_ktm_route.features[0].geometry.coordinates,
  ]);

  const startCoordinate = ldn_ktm_route.features[0].geometry.coordinates[0];

  const endCoordinate = turf.along(route, FAKE_CURRENT_DISTANCE_MILES, {
    units: "miles",
  }).geometry.coordinates;

  const slicedLine = turf.lineSlice(startCoordinate, endCoordinate, route);

  return {
    point:
      slicedLine.geometry.coordinates[
        slicedLine.geometry.coordinates.length - 1
      ],
    line: slicedLine,
  };
};
