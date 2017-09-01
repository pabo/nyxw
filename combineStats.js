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

  // add .personalData.boardTypeRelative
  if (puzzleData[dateKey].daily
      && puzzleData[dateKey].daily.personalData
      && puzzleData[dateKey].daily.personalData.board) {

    puzzleData[dateKey].daily.personalData.boardTypeRelative = isRelative(puzzleData[dateKey].daily.personalData.board);
  }

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

function isRelative(board) {
  return !board.some((square) => { return parseTimestamp(square) > 1000000000 })
}

function parseTimestamp(text) {
  return parseInt(text.split("|")[2], 10); // "S|0|29" -> 29
}

module.exports = { 
  puzzles
};
