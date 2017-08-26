## setup
```
git clone
npm install
```

#### auth
1. Log in to nytimes crossword site.
2. Go to a valid puzzle json url like http://www.nytimes.com/svc/crosswords/v2/game/12503.json
3. In network panel, copy your Cookie: header and update the getData script with it

## download the data
```
node getPersonalData.js
node getPuzzleData.js
```

## graph the data
tbd


## TODO
- go back and re-fetch all v2 personal data with v6
- how to order scatter plots to control zaxis type issues
- how to log scale opacity/size (or tanh or something)
- do I have off by one error across the midnight boundary?