import React from 'react';
import {compileExpression, sample} from './sampler';
import scales from 'scales/scales';

function clampRange(vLo, vHi, gLo, gHi) {
  var hi = Math.min(vHi, gHi);
  var lo = Math.max(vLo, gLo);
  if (lo <= hi) {
    return [lo, hi]
  }
}

function renderLine(domain, range, points) {
  var [dminX, dmaxX, dminY, dmaxY] = domain;
  var [rminX, rmaxX, rminY, rmaxY] = range;

  var xScale = scales.linear().domain([dminX, dmaxX]).range([rminX, rmaxX]);
  var yScale = scales.linear().domain([dminY, dmaxY]).range([rmaxY, rminY]);

  var scaledDx = xScale(points[0][0].hi) - xScale(points[0][0].lo);
  var minWidthHeight = Math.max(scaledDx, 1);
  var path = '';
  for (var i = 0, length = points.length; i < length; i += 1) {
    if (points[i]) {
      var x = points[i][0];
      var y = points[i][1];
      var yLo = y.lo;
      var yHi = y.hi;
      // scaledDX is added because of the stroke-width
      var moveX = xScale(x.lo) + scaledDx / 2;
      var [vLo, vHi] = clampRange(
        rminY, rmaxY,
        isFinite(yHi) ? yScale(yHi) : -Infinity,
        isFinite(yLo) ? yScale(yLo) : Infinity
      ) || [-minWidthHeight, 0];
      path += ' M ' + moveX + ' ' + vLo;
      path += ' v ' + Math.max(vHi - vLo, minWidthHeight)
    }
  }
  return path;
}
export default React.createClass({
  render() {
    console.log(this.props.functionText);
    try {
      var compiledExpression = compileExpression(this.props.functionText);
      var func = (x) => compiledExpression.eval({ x });
      var samples = sample(this.props.graph.axis, this.props.graph.width * 2, func);
      var range = [0, this.props.graph.width, 0, this.props.graph.height];
      var lineText = renderLine(this.props.graph.axis, range, samples);
      return (
        <path className="line line-0" fill="none" strokeWidth="1" stroke="#4682b4" opacity="1"
              d={lineText}/>
      );
    } catch (e) {
      return false;
    }
  }
});