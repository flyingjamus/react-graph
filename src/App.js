import React, { Component } from 'react';
import Graph from './Graph';
import Plot from './Plot';

export default React.createClass({
  render() {
    console.log(this.state)
    return (
      <div>
        <Graph {...this.props.graph}>
          <Plot functionText={this.state.functionText}
                graph={this.state.graph}
          />
        </Graph>
        <input type="text"
               value={this.state.functionText}
               onChange={this.setFunctionText}
        />
      </div>
    );
  },
  getInitialState() {
    return {
      functionText: 'x^2',
      graph: {
        width: 200,
        height: 200,
        axis: [-6, 6, -4, 4]
      }
    };
  },
  setFunctionText(event) {
    this.setState({
      functionText: event.target.value
    });
  }
});
