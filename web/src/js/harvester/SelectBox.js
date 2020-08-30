import React from "react";

import "../../sass/components/SelectBox.sass";

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
          {this.props.options.map((o, i) => {
            return (
              <span
                className={i === this.state.selection ? "selected" : ""}
                key={o}
                onClick={() => {
                  this.setState({ selection: i });
                  this.props.onIndexChange(i);
                }}
              >
                {o}
              </span>
            );
          })}
        </div>
        {React.Children.map(this.props.children, (child, i) =>
          i === this.state.selection ? child : null
        )}
      </div>
    );
  }
}
