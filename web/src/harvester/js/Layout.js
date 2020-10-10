import React from "react";
import { Link } from "react-router-dom";

import "../sass/Layout.AudiovisIO.sass";

function Layout({ children, style, className }) {
  return (
    <div className={className} style={style}>
      {/* <div className="titlebar"> */}
      {/*   <Link className="link" to="/"> */}
      {/*     <h3>audiovis i/o</h3> */}
      {/*   </Link> */}
      {/* </div> */}
      {children}
    </div>
  );
}

export default Layout;
