import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import data from "./example-mapping.json";

import Layout from "./Layout.js";
import Totem from "./Totem.js";

function Finish({ mapping }) {
  const history = useHistory();
  const canvasRef = useRef();

  return (
    <Layout>
      <main className="center-column">
        <span className="emoji">&#127881;</span>
        <h2>Congratulations</h2>
        <h4>You finished 10 mappings</h4>
        <h4 className="token-heading">
          We've built a toten from your mappings (TODO)':
        </h4>
        <Totem mapping={data}></Totem>
        <button className="flow-button" onClick={() => history.push("/flow")}>
          Another round
        </button>
      </main>
    </Layout>
  );
}

export default Finish;
