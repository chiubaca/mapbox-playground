import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const mapContainer = useRef<HTMLElement>(null!);
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2hpdWJhY2EiLCJhIjoiY2lrNWp6NzI2MDA0NmlmbTIxdGVybzF3YyJ9.rRBFEm_VY3yRzpMey8ufKA";

  useEffect(() => {
    var mapGL = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });
    console.log("whats map?, useEffect", mapContainer);
    return () => mapGL.remove();
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
