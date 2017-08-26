let { puzzles } = require("./combineStats");
const msInAWeek = 1000 * 60 * 60 * 24 * 7;
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const colors = {
  "monday": "rgb(39,119,180)", //blue
  "tuesday": "rgb(23,190,207)", //light blue
  "wednesday": "rgb(44,160,44)", //green
  "thursday": "rgb(188,189,34)", //lime
  "friday": "rgb(255,223,7)", //yellow
  "saturday": "rgb(255,127,14)", //orange
  "sunday": "rgb(214,39,40)", //red
}

const defaultFormatting = {
  margin: { t: 0 },
  hovermode: "closest",
};

// create traces for timesByDay graph
let dayTraces = [];
let smaTraces = [];

days.forEach((dayOfWeek) => {
  // filter down to completed daily for this day
  puzzlesOnThisDay = puzzles.filter((puzzle) => {
    return (puzzle.daily
      && puzzle.daily.personalData
      && puzzle.daily.personalData.solved
      && puzzle.dayOfWeek === dayOfWeek
    );
  });

  dayTraces.push(_.merge({},
    {
      type: "scatter",
      mode: "markers",
      name: dayOfWeek,
      legendgroup: dayOfWeek,
      marker: {
        color: colors[dayOfWeek],
        size: 5,
        line: {
          width: .5,
          color: "black"
        }
      }
    },
    createDaySeries({
      puzzles: puzzlesOnThisDay,
      yFunction: (puzzle) => { 
        return puzzle.daily.personalData.timeElapsed/60;
      }
    })
  ));

  smaTraces.push(_.merge({},
    {
      type: "scatter",
      mode: "lines",
      name: `${dayOfWeek} (sma)`,
      legendgroup: dayOfWeek,
      opacity: .4,
      line: {
        width: 5,
        shape: "spline",
        smoothing: 1
      },
      marker: {
        color: colors[dayOfWeek]
      }
    },
    createSmaSeries({
      puzzles: puzzlesOnThisDay,
    })
  ));

  console.log(smaTraces);
});

// create traces for timeOfDay graph
let timeOfDayTraces = [];
days.forEach((dayOfWeek) => {
  // filter down to completed daily for this day
  puzzlesOnThisDay = puzzles.filter((puzzle) => {
    return (puzzle.daily
      && puzzle.daily.personalData
      && puzzle.daily.personalData.solved
      && puzzle.dayOfWeek === dayOfWeek
    );
  });

  timeOfDayTraces.push(_.merge({},
    {
      type: "scatter",
      mode: "markers",
      name: dayOfWeek,
      legendgroup: dayOfWeek,
      marker: {
        color: colors[dayOfWeek],
        size: 5,
        line: {
          width: 1,
          color: "black"
        }
      }
    },
    createDaySeries({ 
      puzzles: puzzlesOnThisDay,
      yFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);

        // a little hacky: set all the Dates to the same year/month/day and preserve the time.
        let timeOnly = new Date(`2017-01-01 ${firstOpened.getHours()}:${firstOpened.getMinutes()}:${firstOpened.getSeconds()}`);

        return timeOnly;
      }
    })
  ));
});


// create traces for solveLength graph
let solveLengthTraces = [];
days.forEach((dayOfWeek) => {
  // filter down to completed daily for this day
  puzzlesOnThisDay = puzzles.filter((puzzle) => {
    return (puzzle.daily
      && puzzle.daily.personalData
      && puzzle.daily.personalData.solved
      && puzzle.dayOfWeek === dayOfWeek
    );
  });

  solveLengthTraces.push(_.merge({},
    {
      type: "scatter",
      mode: "markers",
      name: dayOfWeek,
      legendgroup: dayOfWeek,
      marker: {
        color: colors[dayOfWeek],
        line: {
          width: 2,
          color: "black"
        }
      }
    },
    createDaySeries({ 
      puzzles: puzzlesOnThisDay,
      yFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);

        // a little hacky: set all the Dates to the same year/month/day and preserve the time.
        let timeOnly = new Date(`2017-01-01 ${firstOpened.getHours()}:${firstOpened.getMinutes()}:${firstOpened.getSeconds()}`);

        return timeOnly;
      },
      opacityFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.lastUpdateTime*1000);
        
        const timeDiff = lastUpdateTime - firstOpened;
        // const minTime = 1000 * 60 * 6;
        // maxLogValue = Math.log(timeDiff/minTime);

        return 1 - Math.min(timeDiff/msInAWeek, 1);
      },
      sizeFunction: (puzzle) => {
        const maxSize = 40;
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.lastUpdateTime*1000);

        const timeDiff = lastUpdateTime - firstOpened;
        const rawSize = Math.min(timeDiff,2*msInAWeek);
        const calcSize = Math.round(maxSize*rawSize/msInAWeek);

        return Math.log(timeDiff / (1000 * 60 * 10)) + 5;
      }
    })
  ));
});




// attach the things
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  attachGraphToPage({
    id: "timesByDay",
    traces: [...dayTraces, ...smaTraces],
    formatting: _.merge({}, defaultFormatting, { yaxis: { range: [0,9000/60] } })
  });

  attachGraphToPage({
    id: "timeOfDay",
    traces: timeOfDayTraces,
    formatting: defaultFormatting,
  });

  attachGraphToPage({
    id: "solveLength",
    traces: solveLengthTraces,
    formatting: defaultFormatting,
  });
});





// helpers
function dayOfWeek(yyyymmdd) {
  return days[new Date(yyyymmdd).getDay()];
}

function createDaySeries({puzzles, yFunction, sizeFunction, opacityFunction}) {
  const series = {
    x: puzzles.map((puzzle) => { return puzzle.dateKey; }),
    y: puzzles.map(yFunction),
    marker: {}
  }

  if (sizeFunction) { series.marker.size = puzzles.map(sizeFunction); }
  if (opacityFunction) { series.marker.opacity = puzzles.map(opacityFunction); }

  return series;
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

console.log(series);
  return series;
}

function average (array) {
  return array.reduce((prev, curr) => { return prev + curr; }, 0) / array.length;
}

function associatePuzzlesWithPersonal(dateKey) {
  const thisDailyPuzzle = puzzleData[dateKey].daily;
  const thisMiniPuzzle = puzzleData[dateKey].mini;

  if (thisDailyPuzzle) {
    thisDailyPuzzle.personalData = personalData[thisDailyPuzzle.id];
  }
  if (thisMiniPuzzle) {
    thisMiniPuzzle.personalData = personalData[thisMiniPuzzle.id];
  }
}

function attachGraphToPage({id, traces, formatting}) {
  const graphElement = document.getElementById(id);
  Plotly.plot(graphElement, traces, formatting);
}