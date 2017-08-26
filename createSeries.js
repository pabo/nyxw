function createDaySeries({
  puzzles, 
  yFunction,
  sizeFunction,
  opacityFunction,
  hoverTextFunction
}) {
  return puzzles.reduce((trace, puzzle) => {
    const returnObject = {
      x: [],
      y: [],
      marker: {
        size: [],
        opacity: [],
        hovertext: [],
      }
    };

    returnObject.x = [...trace.x, puzzle.dateKey];
    returnObject.y = [...trace.y, yFunction(puzzle)];

    if (sizeFunction) {
      returnObject.marker.size = [...trace.marker.size, sizeFunction(puzzle)];
    }
    else {
      returnObject.marker.size = 5;
    }
    if (opacityFunction) {
      returnObject.marker.opacity = [...trace.marker.opacity, opacityFunction(puzzle)];
    }
    else {
      returnObject.marker.opacity = 1;
    }
    if (hoverTextFunction) {
      returnObject.marker.hovertext = [...trace.marker.hovertext, hoverTextFunction(puzzle)];
    }

    return returnObject;
  }, {
    x: [],
    y: [],
    marker: {
      size: [],
      opacity: [],
      hovertext: [],
    }
  });
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