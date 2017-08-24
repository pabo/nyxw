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

dates.sort().forEach((date, index, array) => {
  const thisPuzzle = puzzleData[date].daily;
  if (thisPuzzle) {
    console.log(`id is ${date}`);
    const dailyId = thisPuzzle.id;
    const myStats = personalData[dailyId];

    const dayOfWeek = days[new Date(date).getDay()];
    console.log(`dayofweek is ${dayOfWeek}`);

    thisPuzzle.personalStats = myStats;

    if (myStats) {
      if (thisPuzzle.personalStats.solved) {
        if (!solvedDates[dayOfWeek]) {
          solvedDates[dayOfWeek] = [];
        }
        if (!solvedTimes[dayOfWeek]) {
          solvedTimes[dayOfWeek] = [];
        }


        if (thisPuzzle.personalStats.firstSolved) {
          solvedDates[dayOfWeek].push(new Date(1000*thisPuzzle.personalStats.firstSolved));
          solvedTimes[dayOfWeek].push(myStats.timeElapsed);
        }

      }
    }
  }
})

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  //generate week of traces
  let traces = [];
  days.forEach((day, index, array) => {
    traces.push({
      name: day,
      type: "scatter",
      mode: "markers",
      marker: {
        symbol: "cross",
        size: 12,
      },
      x: solvedDates[day],
      y: solvedTimes[day],
    });
    traces.push({
      name: `${day} (sma)`,
      type: "scatter",
      mode: "line",
      x: solvedDates[day],
      y: sma(solvedTimes[day]),
    })
  });

  const graphElement = document.getElementById('graph');
  Plotly.plot(graphElement, traces, {
      margin: { t: 0 },
      yaxis: {
        range: [0,9000]
      }

    });
});


// puzzleData
//   "2017-01-03": {
//     "daily": {
//       "constructors": [
//         "Michael Shteyman"
//       ],
//       "copyright": "2017",
//       "editor": "Will Shortz",
//       "id": 12748,
//       "lastUpdated": "2017-01-01 16:50:01 +0000 UTC",
//       "publicationDate": "2017-01-03"
//     },
//     "mini": {
//       "constructors": [
//         "Joel Fagliano"
//       ],
//       "copyright": "2017",
//       "id": 12764,
//       "lastUpdated": "2017-01-03 16:20:18 +0000 UTC",
//       "publicationDate": "2017-01-03",
//       "subcategory": 2
//     }
//   },

// v6
//   "13762": {
//     "board": [
//       "T|0|312",
//       "R|0|474",
//       "A|0|392",
//       "Y|0|475",
//       "|0|0",
//       "W|0|478",
//       "E|0|458",
//       "S|0|461",
//       "T|0|478"
//     ],
//     "eligible": true,
//     "firstOpened": 1503461215,
//     "firstSolved": 1503461763,
//     "id": "72093224-13762",
//     "isPuzzleInfoRead": false,
//     "lastUpdateTime": 1503461764,
//     "solved": true,
//     "completed": true,
//     "timeElapsed": 501,
//     "epoch": 1503461216
//   },