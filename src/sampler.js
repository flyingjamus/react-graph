'use strict';
import linspace from 'linspace';
import intervalArithmeticEval, {Interval} from 'interval-arithmetic-eval';
// disable the use of typed arrays in interval-arithmetic to improve the performance
intervalArithmeticEval.policies.disableRounding();


export function compileExpression(expression) {
  return intervalArithmeticEval(expression);
}

export function sample(range, nSamples, func) {
  var [xMin, xMax, yMin, yMax] = range;
  //var xCoords = utils.space(chart, range, nSamples)
  var xCoords = linspace(xMin, xMax, nSamples);
  var samples = [];
  xCoords.forEach(function(currentX, i) {
    var x = {lo: xCoords[i], hi: xCoords[i + 1]};
    var y = func.call(null, x);
    if (!Interval.isEmpty(y) && !Interval.isWhole(y)) {
      samples.push([x, y])
    }
    if (Interval.isWhole(y)) {
      // means that the next and prev intervals need to be fixed
      samples.push(null)
    }
  });
  var i;
  // asymptote determination
  for (i = 1; i < samples.length - 1; i += 1) {
    if (!samples[i]) {
      var prev = samples[i - 1];
      var next = samples[i + 1];
      if (prev && next && !Interval.intervalsOverlap(prev[1], next[1])) {
        // case:
        //
        //   |
        //
        //     |
        //
        //   p n
        if (prev[1].lo > next[1].hi) {
          prev[1].hi = Math.max(yMax, prev[1].hi);
          next[1].lo = Math.min(yMin, next[1].lo)
        }
        // case:
        //
        //     |
        //
        //   |
        //
        //   p n
        if (prev[1].hi < next[1].lo) {
          prev[1].lo = Math.min(yMin, prev[1].lo);
          next[1].hi = Math.max(yMax, next[1].hi)
        }
      }
    }
  }

  //samples.scaledDx = xScale(xCoords[1]) - xScale(xCoords[0]) //TODO something?
  return samples;
}