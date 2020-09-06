import React from "react";
import { Link } from "react-router-dom";

import Layout from "./Layout.js";

function Start() {
  return (
    <Layout>
      <main className="two-columns">
        <div className="left">
          <img src="/img/harvester.png" />
        </div>
        <div className="right">
          <h2>Welcome</h2>
          <article>
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
      </main>
      <Link className="flow-button" to="/flow">
        Start
      </Link>
    </Layout>
  );
}

export default Start;
