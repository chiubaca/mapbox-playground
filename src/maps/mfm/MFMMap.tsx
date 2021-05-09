import React, { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";
import { currentDistance } from "../../helpers/calculateCurrentDistance";

// import { animateMarker } from "../../helpers/pulsingDot";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

export default function MFMMap() {
  let map: mapboxgl.Map;
  const mapContainer = useRef<HTMLDivElement>(null!);
  const [dashBoardMode, setDashboardMode] = useState(false);

  const cameraRotateRequestRef = React.useRef(0);
  const puslsingDotRequestRef = React.useRef(0);

  const currentDistanceInfo = currentDistance();

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
    //
    const throttleGrowthSpeed = 200; // lower is faster
    const maxCircleSize = 10;
    // clamp point size to maxCircleSize
    const circleSize = (timestamp / throttleGrowthSpeed) % maxCircleSize;

    map.setPaintProperty("location", "circle-radius", circleSize);

    // Request the next frame of the animation.
    puslsingDotRequestRef.current = requestAnimationFrame(pulsingDotAnimation);
  };

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
        data: currentDistanceInfo.line,
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
                coordinates: currentDistanceInfo.point,
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
    cancelAnimationFrame(cameraRotateRequestRef.current);

    setDashboardMode(true);
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
        "circle-color": "#007cbf",
      },
    });
    puslsingDotRequestRef.current = requestAnimationFrame(pulsingDotAnimation);
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
          <text x="14" y="35" fontFamily="Verdana" fontSize="12" fill="white">
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
