import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import data from "./example-mapping.json";
import md5 from "blueimp-md5";

import Layout from "./Layout.js";
import Totem from "./Totem.js";

function Finish({ mappingJson }) {
  const history = useHistory();
  const canvasRef = useRef();

  const mappings = mappingJson !== undefined ? JSON.parse(mappingJson) : [];

  const prepareDownload = () => {
    const downloadLink = document.createElement("a");
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(mappings));
    downloadLink.href = dataStr;
    downloadLink.download = `${md5(JSON.stringify(mappings))}.json`;
    document.body.append(downloadLink);
    downloadLink.click();
  };

  useEffect(() => {}, []);

  return (
    <Layout>
      <main className="center-column">
        <div>
          <span className="emoji">&#127881;</span>
          <h2>Congratulations</h2>
          <h4>You finished 10 mappings</h4>
          <h4 className="token-heading">
            We've built a toten from your mappings (TODO)':
          </h4>
        </div>
        <Totem mapping={mappings}></Totem>
        <div className="buttons">
          <button onClick={prepareDownload}>Download</button>
          <button onClick={() => history.push("/flow")}>Another round</button>
        </div>
      </main>
    </Layout>
  );
}

export default Finish;
