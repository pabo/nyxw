let request = require("request")

function getCrosswordData(id) {

	return new Promise(function(resolve, reject) {
		request({
			uri: `http://www.nytimes.com/svc/crosswords/v2/game/${id}.json`,
			headers: {
				Host:"www.nytimes.com",
				Connection:"keep-alive",
				Pragma:"no-cache",
				"Cache-Control":"no-cache",
				Accept:"application/json, text/javascript, */*; q=0.01",
				"X-Requested-With":"XMLHttpRequest",
				"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
				"Content-Type":"application/json",
				Referer:"http://www.nytimes.com/crosswords/game/daily/2016/11/02",
				"Accept-Encoding":"gzip, deflate, sdch",
				"Accept-Language":"en-US,en;q=0.8",
				Cookie:`RMID=007f010035b157a284e70041; __gads=ID=f5fe3b4b84a147f6:T=1470268648:S=ALNI_MaYwFHaWzS7cBNdKmh66r30xj-2pQ; __cfduid=dbf4eac75529b466f1e623f4e4d76d2601470276967; archive-sort-order-pref=desc; optimizelyEndUserId=oeu1471102798790r0.5392429468263269; _cb_ls=1; OX_plg=swf|shk|pm; mnet_session_depth=1%7C1474034304805; nyt-m=D90601DC79E761C9160E566CEF850DA3&e=i.1475280000&t=i.10&v=i.3&l=l.15.3016219988.2806197377.1953352177.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1.-1&n=i.2&g=i.0&rc=i.0&er=i.1473694666&vr=l.4.4.2.0.0&pr=l.4.4.2.0.0&vp=i.2&gf=l.10.3016219988.2806197377.1953352177.-1.-1.-1.-1.-1.-1.-1&ft=i.0&fv=i.0&gl=l.2.-1.-1&rl=l.1.-1&cav=i.5&imu=i.1&igu=i.1&prt=i.5&kid=i.1&ica=i.1&iue=i.1&ier=i.0&iub=i.0&ifv=i.0&igd=i.0&iga=i.0&imv=i.0&igf=i.0&iru=i.0&ird=i.0&ira=i.0&iir=i.1&gb=l.3.2.3.1473984000&abn=s.close_door_90_10_jun2016&abv=i.0; _cb=CHEnJ3axi0DwZ59O; _chartbeat2=.1473222916125.1474034310011.10000000111; optimizelySegments=%7B%223007620980%22%3A%22search%22%2C%223013750536%22%3A%22false%22%2C%223028090192%22%3A%22gc%22%2C%223032570147%22%3A%22none%22%2C%223315571554%22%3A%22search%22%2C%223321851195%22%3A%22false%22%2C%223334171090%22%3A%22none%22%2C%223336921036%22%3A%22gc%22%7D; optimizelyBuckets=%7B%225355901213%22%3A%225361970061%22%7D; pickleAdsCampaigns=[{"c":"1215","e":1475732104710,"v":1}]; archive-display-mode=list; _dycst=dk.m.c.ws.frv2.ltos.; _dy_geo=US.NA.US_CA.US_CA_San%20Diego; _dy_df_geo=United%20States.California.San%20Diego; _dy_toffset=-5; _dyus_8765260=13106%7C0%7C0%7C0%7C0%7C0.0.1470276963385.1478582359640.8305396.0%7C311%7C46%7C10%7C116%7C3%7C0%7C0%7C0%7C0%7C0%7C0%7C3%7C0%7C2%7C0%7C0%7C14%7C3%7C16%7C42%7C43%7C0%7C0; __utmx=69104142.9W_cYUmyTfW6JQdQrr7Tpg$0:1; __utmxx=69104142.9W_cYUmyTfW6JQdQrr7Tpg$0:1479186666:8035200; LPCKEY-17743901=afe18464-841c-44ca-8656-e7ed175f8e538-93500%7Cnull%7Cnull%7C40; LPVID=lhOGMxNjRlM2IwYWJmZmZm; LPSID-17743901=UCjeMKdFQyCnU1Q3QQhQsA.577b0375a984ce2e3d9d04f5124e7e6d376fe78b; NYT_W2=New%20YorkNYUS|ChicagoILUS|London--UK|Los%20AngelesCAUS|San%20FranciscoCAUS|Tokyo--JP; nyt-d=101.000000000NAI00000s9Iny1/5I0t0hR00n0cBHik0sFNed0rCJSY1yT6C20M1n8M0RV0Ke0nA3rw072XuK0A37ae0pApKk1/6nCR0V4mTb07VniJ0R2nG607201b1mT6Xs1qQtTt1ZGKHO@afc214ea/3618743d; NYT-BCET=1479997876%7Cj8az9LhHrQJARviHMSuAOzVce8M%3D%7CY%3BCR%7Ct16%2B1RzGL3b8kPZCg%2Frtihmf4HOoCGKE7eVn5eWkBTk%3D; _gat_r2d2=1; _ga=GA1.2.194755892.1470276963; walley=GA1.2.194755892.1470276963; krux_segs=q81w3m8ua%7Cn7szfqqcb%7Cn7szfo8qn%7Cpgxu9tt6o%7Cn7szfnz62%7Cqttxqx43v%7Cn7szfpbyi%7Cqtqec5og8%7Colokhjnjo%7Cqua2t0dn6%7Cpm943wot8%7Cqmv24w226%7Cn7szfpiuz%7Cqygyjrl53%7Cn7szfnicn%7Cqcr8n481e%7Cp1qefu3k5%7Cqx48577uu%7Cose9dhiwy%7Colkt7d9x1%7Cqximumov0%7Cn7szfl4pr%7Cq3jrlrkqw%7Cn7szfq00g%7Cqdrp53wv8%7Cn7szfpp1d%7Cq81ebfhjj%7Cosiap3fde%7Cn7szfn5z4%7Cotaekx8uy%7Cn7szfpn20%7Cn22g2ruph%7Corrl8dtnr%7Cosinwlerj%7Cn2ydv34fb%7Cn7szfnfqa%7Cn7szfpd5c%7Cn7szfq3ce%7Cosik21k99%7Cn7szfo65f%7Cq7i10geam%7Cq81gyua9h%7Cooow7f0je%7Cn7szfoflt%7Cqtqvlyuhn%7Cn7szfm50i%7Cn7szfp3w0%7Cnvj4njqlt%7Cqticqocj0%7Cq7i1m73up%7Cqb86j9v3m%7Coa69uszst%7Cql40lqnw6%7Cn216l2va5%7Cpu4c69vv2%7Cn7szfo3xl%7Cqsx2xjipq%7Cqsq8kj8f7%7Cn7szfmzuo%7Cqtuorrot7%7Cqyg0ox1fy%7Cn7szfohm8%7Cn7szfp1ky%7Cosihzsglx%7Cn21quag21%7Cq4a7tppje%7Cn7szfnjri%7Cq4a7x5esd%7Cquarmjelo%7Cn5t42t45x%7Cor624qgz2%7Coygp13c0e%7Cn7szfqg9h%7Cqrbeo2oxu%7Cpbpvg78ji%7Coqqimgv5i%7Cq5iowqj5c%7Cqsy1x9he1%7Cqtl35m9df%7Cpu4b4quud%7Cqsy4d7wb4%7Cqw1o2558t%7Cn7szfn1lh%7Cqgmiaag4d%7Cqse9oiq0s%7Cn21t57zyj%7Cn7szfozqo%7Cqsvfy1yzk%7Cqsyy8rb9l%7Co7t4tg957%7Cpt77iwoza%7Cn7szfpxrm%7Com37mgsm0%7Cn2xvlx9kc%7Cn7szfosd0%7Cq08sgdly5%7Coj2aw1ioh%7Cn7szfnmzs%7Copjtfyu92%7Cqvg7s1jed%7Coo7ak7npn%7Cn7szfmnx5%7Cq5boh9n5z%7Cn7szfokt4%7Cpi6wc5dib%7Cqs3bm4p9a%7Cn22jdibkh%7Cn7szfmh8l%7Cp098dmw8k%7Cqhmgw4yo7%7Cpgzjhwlxc%7Cn7szfmbfg%7Cpu4cnpapn%7Cn7szfomx3%7Cqtt28tq9y%7Coypsztoyt; _sp_id.75b0=3e718557fe5b40dc.1470276963.63.1479976507.1478970505; _sp_ses.75b0=*; nyt-a=41ecf26f661483913e31b3c2c7793cd9; adxcl=l*458b8=584f804f:1|lcig=584f804f:1; adxcs=s*4534c=0:2; NYT-S=28zvG0P2w0mSQNyd8sQ9qEVimfG1MZSm7Y49JyZzVZuwgu2Nl76Lt095r0Gfw2T9WwbdByfaHOWRxgF0DT1C5mHUMKU.dCidzLyWUsIVes.xvj8Sa5aBniFuvJJp.6isWKFrP3Whsh1EUN.AISRoxjw1ki3IVGDzEFhVM9JaOY4lPevL5Uh6Rar000`
			}
		}, function(err, resp, body) {
			if (resp && resp.statusCode === 200) {
				resolve(body);
			}
			else {
				reject(`xhr failed for ${id}`);
			}
		});
	});
}

module.exports = getCrosswordData;
