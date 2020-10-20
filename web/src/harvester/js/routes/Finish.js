// node_modules imports
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import md5 from "blueimp-md5";
// Local imports
import Layout from "../Layout.js";
import Totem from "../components/Totem.js";
// Style imports
import "../../sass/Finish.sass";
// JSON imports
import data from "../../json/example-mapping.json";

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
    <Layout className="audiovis-io-finish">
      <main className="finish">
        <div className="textblock">
          <div>
            <span className="emoji">&#127881;</span>
            <h2 className="title">Glückwunsch</h2>
            <article>
              Du hast <b>5 Zuordnungen</b> abgeschlossen.
            </article>
            <br />
            <article className="token-heading">
              Wir haben ein <b>Totem</b> aus deinen Zuordnungen generiert,
              welches du rechts erkunden kannst.
            </article>
          </div>
        </div>
        <div className="totem">
          <Totem mapping={mappings}></Totem>
        </div>
        <div className="buttons">
          <button onClick={prepareDownload}>download daten</button>
          <button onClick={() => history.push("/flow")}>Noch eine Runde</button>
        </div>
      </main>
    </Layout>
  );
}

export default Finish;
