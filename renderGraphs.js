let { puzzles } = require("./combineStats");
let { createDaySeries, createSmaSeries } = require("./createSeries");

const msInADay = 1000 * 60 * 60 * 24;
const msInAWeek = msInADay * 7;
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

const sizeScale = createScalingFunction({
  inputMin: 1000 * 60 * 6,
  inputMax: msInADay,
  outputMin: 5,
  outputMax: 100,
  clipping: true,
  useLog: true
});

const opacityScale = createScalingFunction({
  inputMin: 1000 * 60 * 6,
  inputMax: msInADay,
  outputMin: .05,
  outputMax: .5,
  reverse: true,
});


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
      hoverinfo: "text",
      marker: {
        color: colors[dayOfWeek],
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
      },
      opacityFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);
        
        const timeDiff = lastUpdateTime - firstOpened;

        var scaled;
        try {
          scaled = opacityScale(timeDiff);
        } 
        catch (error) {
          console.log("error", puzzle);
          scaled = 1;
        }

        return scaled;
      },
      sizeFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);

        const timeDiff = lastUpdateTime - firstOpened;

        var scaled;
        try {
          scaled = sizeScale(timeDiff);
        } 
        catch (error) {
          console.log("error", puzzle);
          scaled = 1;
        }

        return scaled;
      },
      hoverTextFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);

        const timeDiff = lastUpdateTime - firstOpened;

        return `<b>${puzzle.dateKey}</b>
        <br>timeDiff: ${(timeDiff / ( 1000 * 60 )).toFixed(2) } minutes
        <br>opacity: ${opacityScale(timeDiff)}
        <br>size: ${sizeScale(timeDiff)}
        `;
      },
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

console.log("solveLength traces: ", solveLengthTraces);
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

function createScalingFunction({
  outputMin,
  outputMax,
  inputMin,
  inputMax,
  useLog = false,
  reverse = false,
  clipping = false
}) {
  const inputRange = inputMax - inputMin;
  const outputRange = outputMax - outputMin;

  return (input) => {
    if (input < inputMin) {
      console.log(`input ${input} is less than inputMin ${inputMin}`);
    }

    if (input > inputMax) {
      input = clipping ? null : inputMax;
    }

    let inputRatio = (input - inputMin) / inputRange;

    if (useLog) {
      inputRatio = fakeLog(inputRatio);
    }

    const outputSize = reverse ?
     (1 - inputRatio) * outputMax :
     inputRatio * outputMax;

    const output = outputMin + outputSize;

    return output;
  }
}

function fakeLog(x) {
  // return Math.sqrt((2 * x) - (x * x));
  return Math.pow(x,(1/2));
}