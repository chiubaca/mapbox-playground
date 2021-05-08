import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MothersDemo from "./screens/MFMDemo";
import { Playground } from "./screens/Playground";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/mfm-demo">
          <MothersDemo />
        </Route>
        <Route path="/">
          <Playground />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
