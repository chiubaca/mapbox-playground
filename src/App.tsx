import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import * as path from "../data-scripts/output/combined.json";

function App() {
  const mapContainer1 = useRef<HTMLElement>(null!);
  const mapContainer2 = useRef<HTMLElement>(null!);
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

  //map 1
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer1.current,
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

      map.addSource("path", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: path.coordinates,
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
        id: "path",
        type: "line",
        source: "path",
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

  //map 2
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer2.current,
      style: "mapbox://styles/chiubaca/cko8z52hk19os17o9epehszt0",
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
    });

    return () => map.remove();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite, React, TS &amp; Mapbox!</p>
      </header>

      <h2>Map with GeoJson</h2>
      <div className="map-container" ref={mapContainer1}></div>

      <h2>Map with mapbox dataset</h2>
      <div className="map-container" ref={mapContainer2}></div>
    </div>
  );
}

export default App;
