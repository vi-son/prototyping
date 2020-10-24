// node_modules imports
import React from "react";
import { Link } from "react-router-dom";
// Local imports
import Layout from "../Layout.js";
// SVG imports
import Illustration from "../../../../assets/svg/audiovisio/title-illustration.svg";
// Style imports
import "../../sass/Start.sass";

function Start() {
  return (
    <Layout className="audiovis-io">
      <main className="two-columns">
        <div className="left">
          <h2 className="heading">Willkommen</h2>
          <article className="text">
            Herzlich willkommen, du bist im Begriff Kunst zu machen. In den
            nächsten Minuten kannst du uns helfen, kreativ zu sein. Kreativität
            braucht eine Grundlage, eine Inspiration. Und diese Grundlage wollen
            wir hier schaffen. Der Mixing Senses-Harvester ist ein freundliches
            Datensammeltool. Wir lassen dich Dinge hören und sehen - und du
            kannst uns sagen, was du dazu fühlst. Das machst du, indem du einen
            Farbwert auswählst oder ein passendes Wort schreibst. Später werden
            diese Eingaben eine Datenbasis ergeben, die wir zur Visualisierung
            verwenden können; in welcher Form auch immer (verfremdend,
            inspirierend, erschütternd, faszinierend). Während unserer
            Ausstellung zeigen wir unsere Ergebnisse in spannenden Exponaten.
            Yeah!
          </article>
        </div>
        <div className="right">
          <div className="illustration-wrapper">
            <Illustration />
          </div>
          <Link className="start-button" to="/flow">
            Loslegen
          </Link>
        </div>
      </main>
    </Layout>
  );
}

export default Start;
