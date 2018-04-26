var bot = require('./bot');
var postTweet = bot.postTweet;
var https = require('https');
var tweetFrequency = 300000;

function priceChange(data) {
	var dataObj = JSON.parse(data);
	var quote = dataObj['quote'];
	var news = dataObj['news'];
	var tweet = '';
	if (quote) {
		var change = quote['change'];
		var symbol = quote['symbol'];
		var open = quote['open'];
		var pctDay = Math.round((change / open) * 10000) / 100;
		var upDwn = 'up ';
		var sentenceEnders = ['today', 'on the day', 'so far today', 'from opening'];
		if (change < 0) {
			var upDwn = 'down ';
			change = change * -1;
		}
		tweet = symbol + ' is ' + upDwn + change + ' pts (' + pctDay + '%) ' + sentenceEnders[Math.floor(Math.random() * sentenceEnders.length)];
	}
	if (tweet) {
		if (news) {
			tweet += ' ' + news[0]['url'];
		}
		postTweet(tweet);
	}

}

function stockQuery(ticker,reqType){
	https.get('https://api.iextrading.com/1.0/stock/' + ticker + '/batch?types=quote,news,chart&range=1m&last=10', (resp) => {
	  let data = '';
	 
	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	 
	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
	  	priceChange(data);
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	})
}

var i = 0;
tickerArr = ['BAC','COF','CGNX','SNAP','NVDA','GOOG','BABA','MSFT','BRK.A','AAPL','SHOP','AMZN','TWTR','FB','F','TSLA','NFLX','BA','OSTK','SQR','NKE','SHAK','MCD','SBUX','YUM','LUV','DIS'];


stockQuery(tickerArr[Math.floor(Math.random() * tickerArr.length)]);
setInterval(function(){
	if (i == tickerArr.length){
		i = 0;
	}
	stockQuery(tickerArr[i]);
	i++;
},tweetFrequency)