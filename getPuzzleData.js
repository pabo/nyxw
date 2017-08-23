let fs = require("fs");
let { getPuzzleData } = require("./getData.js");
let puzzleData = require("./puzzleData.json");

let timezoneOffsetInHours = new Date().getTimezoneOffset()/60;

// first date
const minDate = new Date(Date.UTC(2000, 0, 1, timezoneOffsetInHours, 0, 0))

let promises = [];
let count = 0;

// construct all promises
for(let date = minDate; date <= Date.now(); date.setDate(date.getDate() + 1)) {
	let formattedDate = formatDate(date);
	if (puzzleData[formattedDate]) {
		// already have data for this day; skip
	}
	else {
		promises.push(getPuzzleData(formattedDate).then(function (data) {
			let json = JSON.parse(data);
			delete(json.body);

			puzzleData[formattedDate] = json;

			count++;
			if (count % 20 === 0) {
				saveData(puzzleData);
			  process.stdout.write(`wrote after ${formattedDate}...`);
			}
		}).catch((error) => {
			console.log(`get data failed: ${error}`);
		}));
	}
}

function formatDate(date) {
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let day = ("0" + date.getDate()).slice(-2);

	return `${year}-${month}-${day}`;
}

Promise.all(promises).then(() => {
  process.stdout.write(`got to the end. saving data...`);
  saveData(puzzleData).then(() => {
    process.stdout.write(`saved.\n`);
	})
});

function saveData(data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile("puzzleData.json", JSON.stringify(data), (err) => {
      if (err) {
				reject(err);
			}
			else {
        resolve();
			}
    });
  });
}