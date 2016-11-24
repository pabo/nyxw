let fs = require("fs");
let getCrosswordData = require("./getCrosswordData.js");

let crosswords = {};
let id = 7641;
let promises = [];
let count = 0;

for(let id = 7641; id < 12502; id++) {
	promises.push(getCrosswordData(id).then(function(data) {
		let json = JSON.parse(data).results;

		crosswords[id] = {
			dayOfWeek: dayOfWeek(id),
			solved: json.solved,
			firstSolved: json.firstSolved,
			timeElapsed: json.timeElapsed
		};
		count++;
		if (count % 20 === 0) {
			saveData(crosswords);
		}
		process.stdout.write(`${id}...`);
	}));
}

Promise.all(promises).then(() => saveData(crosswords));

function saveData(data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile("crosswordData.json", JSON.stringify(data), (err) => {
      if (err) reject(err);
      console.log("saving: success");
      resolve();
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
function dayOfWeek(id) {
	return (id - 1) % 7;
}
