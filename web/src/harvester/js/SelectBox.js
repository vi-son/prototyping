import React from "react";

import "../sass/SelectBox.sass";

export default class SelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: -1
    };
    this.init = this.init.bind(this);
  }

  init() {
    this.setState({ selection: -1 });
  }

  render() {
    return (
      <div className="select">
        <div className="options">
          <div className="description">
            <h3>2. Zuordnung</h3>
            <article>Wähle eine Kategorie</article>
          </div>
          <div className="icons">
            {this.props.options.map((o, i) => {
              return (
                <div
                  key={o}
                  className={[
                    "icon",
                    i === this.state.selection ? "selected" : ""
                  ].join(" ")}
                  onClick={() => {
                    this.setState({ selection: i });
                    this.props.onIndexChange(i, this.props.options[i]);
                  }}
                >
                  <h5>{o}</h5>
                  {this.props.icons[i]}
                </div>
              );
            })}
          </div>
        </div>
        {React.Children.map(this.props.children, (child, i) =>
          i === this.state.selection ? child : null
        )}
      </div>
    );
  }
}
