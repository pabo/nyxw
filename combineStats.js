let puzzleData = require("./puzzleData.json");
let personalData = require("./personalData.json");

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];



let puzzles = [];
const dates = Object.keys(puzzleData);

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

function dayOfWeek(yyyymmdd) {
  return days[new Date(yyyymmdd).getDay()];
}

module.exports = { 
  puzzles
};
