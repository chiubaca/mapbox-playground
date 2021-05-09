import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import { currentDistance } from "../../helpers/calculateCurrentDistance";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

export default function MFMMap() {
  let map: mapboxgl.Map;
  const mapContainer = useRef<HTMLDivElement>(null!);
  const [dashBoardMode, setDashboardMode] = useState(false);

  const cameraRotateRequestRef = React.useRef(0);
  const pulsingDotRequestRef = React.useRef(0);

  const { point, line, distanceSoFar, distanceTogo } = currentDistance();

  // Animation helpers
  const rotateCameraAnimation = (timestamp: number) => {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 500 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 500) % 360, { duration: 0 });

    // Request the next frame of the animation.
    cameraRotateRequestRef.current = requestAnimationFrame(
      rotateCameraAnimation
    );
  };

  const pulsingDotAnimation = (timestamp: number) => {
    const throttleGrowthSpeed = 85; // lower is faster
    const maxCircleSize = 10;
    // clamp point size to maxCircleSize
    const circleSize = (timestamp / throttleGrowthSpeed) % maxCircleSize;
    map.setPaintProperty("location", "circle-radius", circleSize);
    // Request the next frame of the animation.
    pulsingDotRequestRef.current = requestAnimationFrame(pulsingDotAnimation);
  };

  // Initialise mapbox once
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/chiubaca/ckofkafej523q17ryvp4au82j/draft",
      zoom: 12,
      center: [84.18751464765715, 28.64795221351989],
      pitch: 60,
      bearing: 0,
    });

    map.on("load", function () {
      // add route line source
      map.addSource("line", {
        type: "geojson",
        lineMetrics: true,
        data: line,
      });

      //add current location point source
      map.addSource("location", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: point,
              },
            },
          ],
        },
      });

      // Add and set 3D Terrrain source
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem" });
    });

    // start camera rotate animation
    cameraRotateRequestRef.current = requestAnimationFrame(
      rotateCameraAnimation
    );

    return () => map.remove();
  }, []);

  const viewMapHandler = () => {
    //stop camera animation
    cancelAnimationFrame(cameraRotateRequestRef.current);

    // remove hero text
    setDashboardMode(true);

    // pan to whole route, TODO: pan to extent of the walked route?
    map.flyTo({
      center: [40.467, 35.703],
      zoom: 3.13,
      speed: 5,
      bearing: -20,
      pitch: 40,
      curve: 1,
    });

    //add the current walked distance line
    map.addLayer({
      type: "line",
      source: "line",
      id: "line",
      // rainbow gradient effect
      paint: {
        "line-color": "red",
        "line-width": 8,
        // 'line-gradient' must be specified using an expression
        // with the special 'line-progress' property
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "lime",

          0.5,
          "yellow",

          1,
          "red",
        ],
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
    });
    //add walked distance point
    map.addLayer({
      id: "location",
      type: "circle",
      source: "location",
      paint: {
        "circle-radius": 10,
        "circle-color": "red",
      },
    });
    // start animating current location point
    pulsingDotRequestRef.current = requestAnimationFrame(pulsingDotAnimation);
  };

  const HeroOverlay = (
    <div className="mfm--hero-overlay">
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
          <text x="14" y="35" fontFamily="Verdana" fontSize="12" fill="white">
            View
          </text>
        </g>
      </svg>
    </div>
  );
  const DashBoardOverlay = (
    <>
      <div className="mfm--info-ticker">
        <svg
          width="20"
          height="13"
          viewBox="0 0 20 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 4C15.47 4 15.45 4.01 15.42 4.01L11.41 0H7V2H10.59L12.59 4H4.49C2.01 4 0 6.02 0 8.5C0 10.99 2.01 13 4.5 13C6.72 13 8.56 11.38 8.92 9.27L11.04 8C11.02 8.17 11 8.33 11 8.5C11 10.99 13.01 13 15.5 13C17.99 13 20 10.99 20 8.5C20 6.01 17.99 4 15.5 4ZM6.84 9.26C6.52 10.27 5.58 11 4.47 11C3.09 11 1.97 9.88 1.97 8.5C1.97 7.12 3.09 6 4.47 6C5.59 6 6.52 6.74 6.84 7.75H4V9.25L6.84 9.26ZM15.47 11C14.09 11 12.97 9.88 12.97 8.5C12.97 7.12 14.09 6 15.47 6C16.85 6 17.97 7.12 17.97 8.5C17.97 9.88 16.85 11 15.47 11Z"
            fill="#E4503A"
          />
        </svg>
        <span>ALAIN COMPLETED A 13.24MI CYCLE - TODAY AT 9:10AM</span>
      </div>
      <div className="mfm--info-panel">
        <div className="mfm--info-section">
          <span>Distance completed</span>
          <span> {distanceSoFar}mi</span>
        </div>
        <hr />
        <div className="mfm--info-section">
          <span>Distance remaining</span>
          <span>{distanceTogo}mi</span>
        </div>
        <hr />
        <div className="mfm--info-section">
          <span>Funds raised</span>
          <span>£129.99</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="mfm--map" ref={mapContainer}>
      {!dashBoardMode ? HeroOverlay : DashBoardOverlay}
    </div>
  );
}
