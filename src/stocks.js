var bot = require('./bot');
var functionality = require('./functionality');
var postTweet = bot.postTweet;
var https = require('https');
var tweetFrequency = 600000;

function tradingHours(data) {
	var dataObj = JSON.parse(data);
	var quote = dataObj['quote'];
	var news = dataObj['news'];
	var tweet = '';
	if (quote) {
		var week52High = quote['week52High'], week52Low = quote['week52Low'], price = quote['latestPrice'], change = quote['change'], symbol = quote['symbol'], previousClose = quote['previousClose'];
		var pctDay = Math.round(quote['changePercent'] * 10000) / 100;
		var fromLow = Math.floor(((price - week52Low) / week52Low) * 100);
		var fromHigh = Math.floor(((week52High - price) / week52High) * 100);
		var upDwn = 'up ';
		var sentenceEnders = ['today', 'on the day', 'so far today', 'from opening'];
		if (change < 0) {
			var upDwn = 'down ';
			change = change * -1;
		}
		tweet = symbol + ' is ' + upDwn + '$' + change + ' (' + pctDay + '%) ' + sentenceEnders[Math.floor(Math.random() * sentenceEnders.length)] + '.';
		console.log(fromHigh, fromLow);
		if (fromLow > 20 && fromHigh < fromLow) {
			tweet += ' The stock is still up more than ' + fromLow + ' from it\'s 52 week low.'	
		} else if (fromHigh > 20) {
			tweet += ' The stock is still down more than ' + fromHigh + '% from it\'s 52 week high.'	
		}
	}
	if (tweet) {
		if (news) {
			tweet += ' ' + news[0]['url'];
		}
		postTweet(tweet);
	}

}

function nonTradingHours(data){

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
	  	var date = new Date();
	  	var dayOfWeek = date.getDay();
	  	var hour = date.getHours();
	  	if (dayOfWeek < 6 && hour > 6 && hour < 19) {
	  		tradingHours(data);
	  	}
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	})
}

function timedStockRequest(){
	tickerArr = ['SQ','NKE','SHAK','MCD','SBUX','YUM','LUV','DIS','BAC','COF','CGNX','SNAP','NVDA','GOOG','BABA','MSFT','BRK.A','AAPL','SHOP','AMZN','TWTR','FB','F','TSLA','NFLX','BA','P'];
	tickerArr = functionality.shuffleArray(tickerArr);
	stockQuery(tickerArr[0]);
	var i = 1;
	setInterval(function(){
		if (i == tickerArr.length){
			i = 0;
		}
		stockQuery(tickerArr[i]);
		i++;
	},tweetFrequency)
}

timedStockRequest();