import React from "react";
import { Link } from "react-router-dom";

function Layout({ children, style }) {
  return (
    <div className="harvester" style={style}>
      <div className="titlebar">
        <Link className="link" to="/">
          <h3>harvester 2.0</h3>
          <h5>Mapping Audio/X</h5>
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
