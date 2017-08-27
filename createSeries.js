const defaultSize = 5;
const defaultOpacity = 1;
const defaultHoverText = null;
const emptyTraceObject = {
  x: [],
  y: [],
  hovertext: [],
  marker: {
    size: [],
    opacity: [],
  }
};

function createDaySeries({
  puzzles,
  xFunction = (puzzle) => {
    if (
      (new Date(puzzle.dateKey)).getMonth() < 0
      || (new Date(puzzle.dateKey)).getMonth() > 11
      || (new Date(puzzle.dateKey)).getFullYear() < 1990
      || (new Date(puzzle.dateKey)).getFullYear() > 2020
      || (new Date(puzzle.dateKey)).getDate() > 31
      || (new Date(puzzle.dateKey)).getDate() < 0
      || (new Date(puzzle.dateKey)) < (new Date("1990-1-1"))
    ) {
      console.log(`UH OH ${puzzle.dateKey} is bad!`);
      console.log(`UH OH ${puzzle.dateKey} is bad!`);
      console.log(`UH OH ${puzzle.dateKey} is bad!`);
      console.log(`UH OH ${puzzle.dateKey} is bad!`);
    }
    return [puzzle.dateKey]
  },
  yFunction,
  sizeFunction,
  opacityFunction,
  hoverTextFunction
}) {
  return puzzles.reduce((trace, puzzle) => {
    const returnObject = _.merge({}, emptyTraceObject);

    return {
      x: [...trace.x, ...xFunction(puzzle)],
      y: [...trace.y, ...yFunction(puzzle)],
      hovertext: hoverTextFunction ?
        [...trace.hovertext, ...hoverTextFunction(puzzle)] :
        defaultHoverText,
 
      marker: {
        size: sizeFunction ? 
          [...trace.marker.size, ...sizeFunction(puzzle)] :
          defaultSize,

        opacity: opacityFunction ? 
          [...trace.marker.opacity, ...opacityFunction(puzzle)] :
          defaultOpacity,
      }
    };
  }, _.merge({}, emptyTraceObject));
}

function createSmaSeries({puzzles, halfWidth = 5 }) {
  const series = {
    type: "scatter",
    mode: "line",
    x: puzzles.map((puzzle) => { return puzzle.dateKey; }),
    y: puzzles.map((puzzle) => {
      return puzzle.daily.personalData.timeElapsed/60;
    }).reduce((acc, curr, currentIndex, array) => {

      if (currentIndex < halfWidth-1 || currentIndex + halfWidth > array.length ) {
        // not wide enough to go back or forward
        //TODO: for now, return null, but could do better
        return [ ...acc, null];
      }
      else {
        const avg = average(array.slice(currentIndex-halfWidth, currentIndex + halfWidth));
        return [ ...acc, avg];
      }
    }, []),
  };

  return series;
}

function average (array) {
  return array.reduce((prev, curr) => { return prev + curr; }, 0) / array.length;
}

module.exports = {
  createDaySeries,
  createSmaSeries
}