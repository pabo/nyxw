let puzzleData = require("./puzzleData.json");
let personalData = require("./personalData.json");
let sma = require("./sma.js");

const dates = Object.keys(puzzleData);
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];


let solvedDates = {}
let solvedTimes = {};

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

let puzzles = [];

// prep the data
dates.forEach(function (dateKey) {
  // add .personalData
  associatePuzzlesWithPersonal(dateKey);

  // add .dayOfWeek
  puzzleData[dateKey].dayOfWeek = dayOfWeek(dateKey);

  // add .dateKey
  puzzleData[dateKey].dateKey = dateKey;

  // push onto puzzles array
  puzzles.push(puzzleData[dateKey]);
});

// sort it by date
puzzles = puzzles.sort((a, b) => {
  return new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime();
})

const baseTrace = {
  type: "scatter",
  mode: "markers",
  marker: {
    symbol: "cross",
    size: 12,
  },
};

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

  const colors = {
    "monday" : "rgb(39,119,180)", //blue
    "tuesday" : "rgb(23,190,207)", //light blue
    "wednesday" : "rgb(44,160,44)", //green
    "thursday" : "rgb(188,189,34)", //lime
    "friday" : "rgb(255,223,7)", //yellow
    "saturday" : "rgb(255,127,14)", //orange
    "sunday" : "rgb(214,39,40)", //red
  }

  dayTraces.push(Object.assign({},
    baseTrace, 
    {
      name: dayOfWeek,
      legendgroup: dayOfWeek,
      marker: {
        color: colors[dayOfWeek]
      }
    },
    createDaySeries({
      puzzles: puzzlesOnThisDay,
    })
  ));

  smaTraces.push(Object.assign({},
    baseTrace, 
    {
      name: `${dayOfWeek} (sma)`,
      legendgroup: dayOfWeek,
      marker: {
        color: colors[dayOfWeek]
      }
    },
    createSmaSeries({
      puzzles: puzzlesOnThisDay,
    })
  ));
});

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  const graphElement = document.getElementById('graph');
  Plotly.plot(graphElement, [...dayTraces, ...smaTraces], {
      margin: { t: 0 },
      yaxis: {
        range: [0,9000/60]
      }

    });
});

function dayOfWeek(yyyymmdd) {
  return days[new Date(yyyymmdd).getDay()];
}

function createDaySeries({puzzles}) {
  return {
    x: puzzles.map((puzzle) => {
      return puzzle.dateKey;
    }),
    y: puzzles.map((puzzle) => {
      return puzzle.daily.personalData.timeElapsed/60;
    }),
  }
}

function createSmaSeries({puzzles, halfWidth = 5 }) {
  return {
    type: "scatter",
    mode: "line",
    x: puzzles.map((puzzle) => {
      return puzzle.dateKey;
    }),
    y: puzzles.map((puzzle) => {
      return puzzle.daily.personalData.timeElapsed/60;
    }).reduce((acc, curr, currentIndex, array) => {

      if (currentIndex < halfWidth-1 || currentIndex + halfWidth > array.length ) {
        // not wide enough to go back or forward
        //TODO: fix this
        return [ ...acc, null];
      }
      else {
        const avg = average(array.slice(currentIndex-halfWidth, currentIndex + halfWidth));
        console.log(`avg is ${avg}`);
        return [ ...acc, avg];
      }
    }, []),
  }
}

function average (array) {
  return array.reduce((prev, curr) => { return prev + curr; }, 0) / array.length;
}