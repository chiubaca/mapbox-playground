import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import * as data from "../data-scripts/output/geojson_export.json";

function App() {
  const mapContainer = useRef<HTMLElement>(null!);
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 5,
      center: [4.6865447, 47.6878221],
      pitch: 50,
      bearing: 0,
    });

    map.on("load", function () {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      console.log("data", data);

      map.addSource("leg1", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: data.coordinates,
          },
        },
      });

      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // add a sky layer that will show when the map is highly pitched
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      map.addLayer({
        id: "leg1",
        type: "line",
        source: "leg1",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite, React, TS &amp; Mapbox!</p>
      </header>
      <div className="map-container" ref={mapContainer}>
        Map Container
      </div>
    </div>
  );
}

export default App;
