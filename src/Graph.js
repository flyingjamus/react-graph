import React from 'react';
export default React.createClass({
  render() {
    return (
      <svg width="200" height="200">
        {this.props.children}
      </svg>
    );
  }
});
