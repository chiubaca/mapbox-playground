import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";

export default function Map2() {
  const mapContainer = useRef<HTMLElement>(null!);

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

  //map 2
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/chiubaca/cko8z52hk19os17o9epehszt0",
      zoom: 12.5,
      center: [71.24985, 34.05069],
      pitch: 75,
      bearing: 140,
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
          "sky-atmosphere-sun": [1.0, 1.0],
          "sky-atmosphere-sun-intensity": 5,
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainer}></div>;
}
