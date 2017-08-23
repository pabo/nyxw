let fs = require("fs");
let getCrosswordData = require("./getCrosswordData.js");
let crosswordData = require("./crosswordData.json");

const minDay = 7641;
const maxDay = 13762;

let promises = [];
let count = 0;

// construct all promises
for(let id = minDay; id <= maxDay; id++) {
	if (crosswordData[id]) {
		// already have data for this day; skip
	}
	else {
		promises.push(getCrosswordData(id).then(function (data) {
			let json = JSON.parse(data).results;

			crosswordData[id] = json;

			count++;
			if (count % 20 === 0) {
				saveData(crosswordData);
			  process.stdout.write(`wrote after ${id}...`);
			}
		}));
	}
}

Promise.all(promises).then(() => {
  process.stdout.write(`got to the end. saving data...`);
  saveData(crosswordData).then(() => {
    process.stdout.write(`saved.\n`);
	})
});


function saveData(data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile("crosswordData.json", JSON.stringify(data), (err) => {
      if (err) {
				reject(err);
			}
			else {
        resolve();
			}
    });
  });
}

// 7641 is a wednesday
// 7641 % 7 is 4
// subtract 1 to make it line up with this:
// 0: sunday
// 1: monday
// 2: tues
// 3: wed
//TODO: does this handle leap year?
function dayOfWeek(id) {
	return (id - 1) % 7;
}
		// example json response
		// json = {
	  //   board: [ ... ],
		//   eligible: false,
		//   firstOpened: 1479883329,
		//   firstSolved: 1479883993,
		//   id: '72093224-12500',
		//   isPuzzleInfoRead: false,
		//   lastUpdateTime: 1479959785,
		//   solved: true,
		//   completed: true,
		//   timeElapsed: 626,
		//   epoch: 1479883332
		//	}

		// calculated fields. disabled for now
    // json.dayOfWeek = dayOfWeek(id);
    //		crosswords[id] = {
    //			dayOfWeek: dayOfWeek(id),
    //			solved: json.solved,
    //			firstSolved: json.firstSolved,
    //			timeElapsed: json.timeElapsed
		//		};

