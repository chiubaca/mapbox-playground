import React, { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";

import * as path from "../../../data-scripts/output/combined.json";

mapboxgl.accessToken = import.meta.env.VITE_NB_MAPBOX_KEY as string;

export default function MFMMap() {
  let map: mapboxgl.Map;
  const mapContainer = useRef<HTMLDivElement>(null!);
  const [rotate, setRotate] = useState(true);

  //map 3
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/neverbland-studio/cko64s47z2tzq19pqrfw1pws9",
      zoom: 12,
      center: [84.18751464765715, 28.64795221351989],
      pitch: 60,
      bearing: 0,
    });

    function rotateCamera(timestamp: number) {
      // clamp the rotation between 0 -360 degrees
      // Divide timestamp by 500 to slow rotation to ~10 degrees / sec
      map.rotateTo((timestamp / 500) % 360, { duration: 0 });

      if (rotate) {
        // Request the next frame of the animation.
        requestAnimationFrame(rotateCamera);
      }
    }

    map.on("load", function () {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: "mapbox-dem" });

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

      rotateCamera(0);
    });

    return () => map.remove();
  }, []);

  return (
    <div className="mfm-map" ref={mapContainer}>
      <div className="overlay-canvas">
        <button className="test-button">Test</button>
      </div>
    </div>
  );
}
