import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Flow from "./Flow.js";
import Layout from "./Layout.js";
import Start from "./Start.js";
import Finish from "./Finish.js";
import AudioPlayer from "./AudioPlayer.js";
import ShapeInput from "./ShapeInput.js";
import FeelingsInput from "./FeelingsInput.js";
import ColorInput from "./ColorInput.js";

const Harvester = () => {
  const [mappingJson, setMappingJson] = useState(undefined);

  const exampleMapping = require("./example-mapping.json");

  return (
    <Router
      basename={
        String(window.location).includes("/__/")
          ? "/__/harvester/harvester.html"
          : ""
      }
    >
      <Switch>
        <Route exact path="/">
          <Start />
          {/* <Finish mappingJson={JSON.stringify(exampleMapping)} /> */}
        </Route>
        <Route path="/flow">
          <Flow
            onFinish={(mappingJson, history) => {
              setMappingJson(mappingJson);
              history.push("/harvester.html/result");
            }}
          />
        </Route>
        <Route path="/harvester.html/result">
          <Finish mappingJson={mappingJson} />
        </Route>
      </Switch>
    </Router>
  );
};

const mount = document.querySelector("#mount");
ReactDOM.render(<Harvester />, mount);
