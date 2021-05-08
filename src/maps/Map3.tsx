import React, { useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";

import * as path from "../../data-scripts/output/combined.json";

export default function Map3() {
  const mapContainer = useRef<HTMLDivElement>(null!);

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;

  //map 3
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/chiubaca/cko8z52hk19os17o9epehszt0",
      zoom: 3,
      center: [4.6865447, 47.6878221],
      pitch: 10,
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

    // wait for the terrain and sky to load before starting animation
    map.on("load", function () {
      let animationDuration = 5000000;
      let cameraAltitude = 20000;

      // get the overall distance of each route so we can interpolate along them
      let routeDistance = turf.lineDistance(turf.lineString(path.coordinates));
      let cameraRouteDistance = turf.lineDistance(
        turf.lineString(path.coordinates)
      );

      let start: number;
      function frame(time: number) {
        if (!start) start = time;
        // phase determines how far through the animation we are
        var phase = (time - start) / animationDuration;

        // phase is normalized between 0 and 1
        // when the animation is finished, reset start to loop the animation
        if (phase > 1) {
          // wait 1.5 seconds before looping
          setTimeout(function () {
            start = 0.0;
          }, 1500);
        }

        // use the phase to get a point that is the appropriate distance along the route
        // this approach syncs the camera and route positions ensuring they move
        // at roughly equal rates even if they don't contain the same number of points
        var alongRoute = turf.along(
          turf.lineString(path.coordinates),
          routeDistance * phase
        ).geometry.coordinates;

        var alongCamera = turf.along(
          turf.lineString(path.coordinates),
          cameraRouteDistance * phase
        ).geometry.coordinates;

        var camera = map.getFreeCameraOptions();

        // set the position and altitude of the camera
        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
          {
            lng: alongCamera[0],
            lat: alongCamera[1],
          },
          cameraAltitude
        );

        // tell the camera to look at a point along the route
        camera.lookAtPoint({
          lng: alongRoute[0],
          lat: alongRoute[1],
        });

        map.setFreeCameraOptions(camera);

        window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    });

    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainer}></div>;
}
