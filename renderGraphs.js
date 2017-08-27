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
        return [puzzle.daily.personalData.timeElapsed/60];
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

        return [timeOnly(firstOpened)];
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

        return [timeOnly(firstOpened)];
      },
      opacityFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);
        
        const timeDiff = lastUpdateTime - firstOpened;

        return [opacityScale(timeDiff)];
      },
      sizeFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);

        const timeDiff = lastUpdateTime - firstOpened;

        return [sizeScale(timeDiff)];
      },
      hoverTextFunction: (puzzle) => {
        let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
        let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);

        const timeDiff = lastUpdateTime - firstOpened;

        return [`<b>${puzzle.dateKey}</b>
        <br>timeDiff: ${(timeDiff / ( 1000 * 60 )).toFixed(2) } minutes
        <br>opacity: ${opacityScale(timeDiff)}
        <br>size: ${sizeScale(timeDiff)}
        `];
      },
    })
  ));
});


// create traces for activityScatter graph
let activityScatterTraces = [];

days.forEach((dayOfWeek) => {
  // filter down to completed daily for this day
  puzzlesOnThisDay = puzzles.filter((puzzle) => {
    return (puzzle.daily
      && puzzle.daily.personalData
      && puzzle.daily.personalData.board
      // TODO could make a different trace for solved vs not, so it can be toggled
      // && puzzle.daily.personalData.solved
      && puzzle.dayOfWeek === dayOfWeek
    );
  });

  // scatter traces for each day
  activityScatterTraces.push(_.merge({},
    {
      type: "scatter",
      mode: "markers",
      name: dayOfWeek,
      legendgroup: dayOfWeek,
      // hoverinfo: "text",
      marker: {
        symbol: "square",
        color: colors[dayOfWeek],
      }
    },
    createDaySeries({ 
      puzzles: puzzlesOnThisDay,
      xFunction: (puzzle) => {
        let firstOpened = puzzle.daily.personalData.firstOpened;
        return puzzle.daily.personalData.board.reduce((acc, curr) => {
          const secondsThreshhold = 1000000000; //anything less is seconds from start
          const timestamp = parseInt(curr.split("|")[2],10); // "S|0|29" -> 29
          if (timestamp > secondsThreshhold) {
            //absolute timestamp
            return [...acc, dateOnly(new Date(timestamp * 1000))];
          }
          else if (timestamp < 0) {
            console.warn(`timestamp ${timestamp} is negative. setting to 0`);
            return [...acc, dateOnly(new Date(firstOpened * 1000))];
          }
          else {
            return [...acc, dateOnly(new Date((firstOpened + timestamp) * 1000))];
          }
        }, []);
      },
      yFunction: (puzzle) => {
        let firstOpened = puzzle.daily.personalData.firstOpened;
        return puzzle.daily.personalData.board.reduce((acc, curr) => {
          secondsThreshhold = 1000000000; //anything less is seconds from start
          const timestamp = parseInt(curr.split("|")[2],10); // "S|0|29" -> 29
          if (timestamp > secondsThreshhold) {
            //absolute timestamp
            return [...acc, timeOnly(new Date(timestamp * 1000))];
          } 
          else {
            return [...acc, timeOnly(new Date((firstOpened + timestamp) * 1000))];
          }
        }, []);
      },
      hoverTextFunction: (puzzle) => {
        return puzzle.daily.personalData.board.reduce((acc, curr) => {
          let firstOpened = new Date(puzzle.daily.personalData.firstOpened*1000);
          let lastUpdateTime = new Date(puzzle.daily.personalData.firstSolved*1000);

          const timeDiff = lastUpdateTime - firstOpened;

          const text = [`<b>${puzzle.dateKey}</b>
          <br>timeDiff: ${(timeDiff / ( 1000 * 60 )).toFixed(2) } minutes
          <br>opacity: ${opacityScale(timeDiff)}
          <br>size: ${sizeScale(timeDiff)}
          <br>puzzleId: ${puzzle.daily.id}
          `];

          return [...acc, text];
        }, []);
      },
    }),
    { markers: { size: 1 } }
  ));

});

// bar traces to shade weekends
// activityScatterTraces.unshift({
//   x: [ dateOnly(new Date("2016-05-05")) ],
//   y: [ timeOnly(new Date("2017-01-01 12:01:23")) ],
//   type: "bar",
// });

activityScatterTraces.unshift(_.merge({}, {
  type: "bar",
  name: "weekends",
  legendgroup: "weekends",
  hoverinfo: "none",
  width: msInADay,
  marker: {
    color: "rgb(250,250,250)"
  }
},
createDaySeries({
  puzzles,
  xFunction: (puzzle) => {
    if (new Date(puzzle.dateKey) < new Date("2015-01-01")) {
      return [];
    }
    else {
      return [puzzle.dateKey];
    }
  },
  yFunction: (puzzle) => {
    if (new Date(puzzle.dateKey) < new Date("2015-01-01")) {
      return [];
    }
    else {
      return isWeekend(puzzle.dateKey) ?
       [timeOnly(new Date("2017-01-01 23:59:59"))]
       : [timeOnly(new Date("2017-01-01 00:00:00"))];
    }
  }
})));

// delete activityScatterTraces[7].marker;







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

console.log("solveLength traces: ", activityScatterTraces);
  attachGraphToPage({
    id: "activityScatter",
    traces: activityScatterTraces,
    formatting: defaultFormatting,
  });
});





// helpers

// dateKey looks like "YYYY-MM-DD"
// returns look like "monday"
function dayOfWeek(dateKey) {
  return days[new Date(dateKey).getDay()];
}

function isWeekend(dateKey) {
  const dayOfWeek = new Date(dateKey).getDay();

  return (dayOfWeek === 5 || dayOfWeek === 6);
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

// maps [0,1] -> [0,1] but with some logarithmic-like curve
function fakeLog(x) {
  // return Math.sqrt((2 * x) - (x * x));
  return Math.pow(x,(1/2));
}

function timeOnly(date) {
  // a little hacky: set all the Dates to the same year/month/day and preserve the time.
  const timeOnly = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const dateTime = new Date(`1970-01-01 ${timeOnly}`);
  return dateTime;

  //also hacky: return time without delimters. this gets converted to a number though.
  // return `${padTime(date.getHours())}${padTime(date.getMinutes())}${padTime(date.getSeconds())}`;
}

function secondsPastMidnight(date) {
  // return the number of seconds
  return ((date.getHours() * 60) + date.getMinutes()) * 60 + date.getSeconds();
}

function dateOnly(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

// function padTime(number) {
//   return ("00" + number).slice(-2);
// }