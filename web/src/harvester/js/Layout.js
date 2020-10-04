import React from "react";
import { Link } from "react-router-dom";

function Layout({ children, style }) {
  return (
    <div className="harvester" style={style}>
      <div className="titlebar">
        <Link className="link" to="/">
          <h3>audiovis i/o</h3>
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
