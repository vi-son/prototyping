import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import Flow from "./Flow.js";
import Layout from "./Layout.js";
import Start from "./Start.js";
import Finish from "./Finish.js";

const Harvester = () => {
  return (
    <Router
      basename={
        String(window.location).includes("/__/")
          ? "/__/harvester/harvester.html"
          : ""
      }
    >
      <div>
        <Switch>
          <Route exact path="/">
            <Start />
          </Route>
          <Route path="/flow">
            <Flow />
          </Route>
          <Route path="/harvester.html/result">
            <Finish />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

const mount = document.querySelector("#mount");
ReactDOM.render(<Harvester />, mount);
