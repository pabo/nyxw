let request = require("request")

function getPersonalData(id) {
	return _getData({
		uri: `http://www.nytimes.com/svc/crosswords/v2/game/${id}.json`,
	});
}

// date is yyyy-mm-dd
function getPuzzleData( { date, stream = daily }) {
	return _getData({
		uri: `http://www.nytimes.com/svc/crosswords/v6/puzzle/${stream}/${date}.json`
	})
}

function _getData({ uri }) {
	return new Promise(function(resolve, reject) {
		request({
			uri,
      "headers": {
    		"cookie": `RMID=007f0100288f58e9c4d6008e; adxcs=-; __gads=ID=f4d02e3c5930e2a9:T=1491715286:S=ALNI_MZjDmFtmQnt7866-JNZaQOHu1PfWA; edu_cig_opt=%7B%22isEduUser%22%3Afalse%7D; b2b_cig_opt=%7B%22isCorpUser%22%3Afalse%7D; __cfduid=d7fb70b44c374feea1a9359b2037db2ee1491715291; _cb_ls=1; __utma=69104142.662219440.1491715294.1492192884.1492208826.2; __utmc=69104142; __utmz=69104142.1492208826.2.2.utmcsr=feedspot.com|utmccn=(referral)|utmcmd=referral|utmcct=/; archive-display-mode=grid; archive-sort-order-pref=desc; nyt-games=legacy%2020pct; nyt-m=D8867D598228CBDD63EB5F0221404776&e=i.1498867200&t=i.10&v=i.1&l=l.15.1822042031.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1&n=i.2&g=i.0&rc=i.0&er=i.1497376882&vr=l.4.1.0.1.0&pr=l.4.1.0.2.0&vp=i.1&gf=l.10.1822042031.-1.-1.-1.-1.-1.-1.-1.-1.-1&ft=i.0&fv=i.0&gl=l.2.-1.-1&rl=l.1.-1&cav=i.1&imu=i.1&igu=i.1&prt=i.5&kid=i.1&ica=i.1&iue=i.0&ier=i.0&iub=i.1&ifv=i.0&igd=i.0&iga=i.1&imv=i.1&igf=i.0&iru=i.0&ird=i.0&ira=i.0&iir=i.0&gb=l.3.1.3.1498608000; NYT_W2=New%20YorkNYUS|ChicagoILUS|London--UK|Los%20AngelesCAUS|San%20FranciscoCAUS|Tokyo--JP; nyt-d=101.000000000NAI00000YAIWo0%2CPN5%2F0R4niB0J1sK00qA2qX1Z0XO70H5XLy0qAYuf0tUWSA0U0me21v7de70A7XSD036n451vQN5q1lSNTk1oVrX1%40423eadca%2F2c27e4c0; NYT-BCET=1503488278%7Cj8az9LhHrQJARviHMSuAOzVce8M%3D%7CY%3BCR%7C2rbxxVFcfg47rpQ6nzCAunltwvSLZ%2FRBAC812tm3NHU%3D; NYT-S=28g0dqczDbT.UNyd8sQ9qEVimfG1MZSm7Y49JyZzVZuwgu2Nl76Lt09cBDdcjFTOn9fp8XzKDsfkSRo6k.7olma73Xs.yq933BQT8cifed0LAB6LUeoZ3KRevJJp.6isWKFrP3Whsh1EUom0vleZTtNB44zmZEBTazhVM9JaOY4lPevL5Uh6Rar000; optimizelyEndUserId=oeu1491715298033r0.044980665831062305; vi_www_hp=9; _ga=GA1.2.662219440.1491715294; _gid=GA1.2.651628528.1503466702; walley=GA1.2.662219440.1491715294; walley_gid=GA1.2.1297051015.1503466680; nyt-a=bb25f629317d2d182cccda34ac3b515f; _cb=D9zMxJBNoEjYBRKayx; _chartbeat2=.1492192885100.1503466705937.0000000000000001.Bqu8FuS-qJg4bPqNBqIjODDMMr92; _cb_svref=https%3A%2F%2Fwww.nytimes.com%2Fcrosswords%2Findex.html%3Fpage%3Dhome%26_r%3D1%26page%3Dhome%26; _sp_id.75b0=61f189b2f1eb5d69.1491715299.20.1503467277.1497854356; _sp_ses.75b0=*`,
  		}
		}, function(err, resp, body) {
			if (resp && resp.statusCode === 200) {
				resolve(body);
			}
			else {
				reject(`xhr failed for ${uri}`);
			}
		});
	});
}

module.exports = { 
	getPersonalData,
	getPuzzleData
};