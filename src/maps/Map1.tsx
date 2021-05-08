import React, { ReactEventHandler, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";
import * as turf from "@turf/turf";
import * as path from "../../data-scripts/output/combined.json";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

export default function Map1() {
  let map: mapboxgl.Map;

  const line = turf.lineString(path.coordinates);
  const length = turf.length(line, { units: "miles" });

  console.log("distance >>>", length);

  const mapContainer = useRef<HTMLDivElement>(null!);

  const [distanceAlongPath, setDistanceAlongPath] = useState(0);

  const [locationAlongPath, setLocationAlongPath] = useState(
    turf.along(line, distanceAlongPath, {
      units: "miles",
    })
  );

  const [marker, setMarker] = useState(
    new mapboxgl.Marker({
      color: "#FFFFFF",
    }).setLngLat(locationAlongPath.geometry.coordinates as [number, number])
  );

  //map 1
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 2.2,
      center: [48.93556286533297, 46.57758836959426],
      pitch: 25,
      bearing: 0,
    });

    map.on("load", function () {
      console.log("loading map");

      // add walking path
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
      // style path
      map.addLayer({
        id: "path",
        type: "line",
        source: "path",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#a02929",
          "line-width": 8,
        },
      });
    });

    // add point to map
    marker.addTo(map);
    marker.setPopup(new mapboxgl.Popup().setHTML(`Lets GO!`)); // add popup

    //Cleanup
    return () => map.remove();
  }, []);

  const increaseDistanceHandler = () => {
    let currentDist = distanceAlongPath;

    setDistanceAlongPath(currentDist + 100);
    setLocationAlongPath(
      turf.along(line, currentDist++, {
        units: "miles",
      })
    );

    marker.setLngLat(
      locationAlongPath.geometry.coordinates as [number, number]
    );
  };

  const decreaseDistanceHandler = () => {
    let currentDist = distanceAlongPath;

    if (currentDist < 10) {
      return;
    }

    setDistanceAlongPath(currentDist - 100);
    setLocationAlongPath(
      turf.along(line, currentDist++, {
        units: "miles",
      })
    );

    marker.setLngLat(
      locationAlongPath.geometry.coordinates as [number, number]
    );
  };

  return (
    <>
      <div className="map-container" ref={mapContainer}></div>
      <div className="buttons">
        <button onClick={decreaseDistanceHandler}>👈 Go backwards</button>
        <button onClick={increaseDistanceHandler}>Go forward 👉</button>
      </div>
    </>
  );
}
