import React, { useEffect, useRef, useState } from "react";
// import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

export default function MFMMap() {
  let map: mapboxgl.Map;
  const mapContainer = useRef<HTMLDivElement>(null!);
  const [dashBoardMode, setdashBoardMode] = useState(false);

  const requestRef = React.useRef(0);

  const rotateCamera = (timestamp: number) => {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 500 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 500) % 360, { duration: 0 });

    // console.log("rotate?", rotate);

    // Request the next frame of the animation.
    requestRef.current = requestAnimationFrame(rotateCamera);
  };

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/chiubaca/ckofkafej523q17ryvp4au82j",
      zoom: 12,
      center: [84.18751464765715, 28.64795221351989],
      pitch: 60,
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
      map.setTerrain({ source: "mapbox-dem" });
    });

    // start rotate animation
    requestRef.current = requestAnimationFrame(rotateCamera);

    return () => map.remove();
  }, []);

  const viewMapHandler = () => {
    cancelAnimationFrame(requestRef.current);
    setdashBoardMode(true);
    map.flyTo({
      center: [40.467, 35.703],
      zoom: 3.13,
      speed: 5,
      bearing: 0,
      pitch: 0,
      curve: 1,
    });
  };

  const HeroOverlay = (
    <div className="mfm--overlay">
      <p className="mfm--hero-text">Track our Progress</p>

      <svg
        onClick={viewMapHandler}
        className="mfm--view-map "
        width="48"
        height="50"
        viewBox="0 0 58 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M57.06 39.3V20.7L46.14 5.7L28.56 0L10.92 5.7L0 20.7V39.3L10.92 54.3L28.56 60L46.14 54.3L57.06 39.3Z"
            fill="#E4503A"
          />
          <text x="14" y="35" font-family="Verdana" font-size="12" fill="white">
            View
          </text>
        </g>
      </svg>
    </div>
  );
  const DashBoardOverlay = <div>hello</div>;

  return (
    <div className="mfm--map" ref={mapContainer}>
      {!dashBoardMode ? HeroOverlay : DashBoardOverlay}
    </div>
  );
}