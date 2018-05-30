var bot = require('./twitter');
var functionality = require('./functionality');
var postTweet = bot.postTweet;
var https = require('https');
var tweetFrequency = 600000;
var tickerArr = require('./tickers').tickers;
var slide = bot.slide;
var getFollowers = bot.getFollowers;
var autoDM = bot.autoDM;

function randomFrequency(tweetFrequency) {
	return tweetFrequency * Math.random() * 2;
}

function tradingHours(data,ticker) {
	var dataObj = JSON.parse(data);
	var quote = dataObj['quote'];
	var news = dataObj['news'];
	var tweet = '';
	if (quote) {
		var name = quote['companyName'];
		var week52High = quote['week52High']; 
		var week52Low = quote['week52Low']; 
		var price = quote['latestPrice']; 
		var change = (Math.round(quote['change']*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
		var symbol = quote['symbol']; 
		var previousClose = quote['previousClose'];
		var pctDay = (Math.round(quote['changePercent']* 100 *Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
		var fromLow = Math.floor(((price - week52Low) / week52Low) * 100);
		var fromHigh = Math.floor(((week52High - price) / week52High) * 100);
		var upDwn = 'up ';
		var sentenceEnders = ['today', 'on the day', 'so far today', 'from opening'];
		if (change < 0) {
			var upDwn = 'down ';
			change = change * -1;
		}
		tweet = name + ' is ' + upDwn + '$' + change + ' (' + pctDay + '%) ' + sentenceEnders[Math.floor(Math.random() * sentenceEnders.length)] + '.';
		if (fromLow > 25 && fromHigh < fromLow) {
			tweet += ' The stock is up more than ' + fromLow + '% from it\'s 52 week low.'	
		} else if (fromHigh > 25) {
			tweet += ' The stock is down more than ' + fromHigh + '% from it\'s 52 week high.'	
		}
	}
	// var hashTags = ['stocks', 'trading','iexAPI']; ' #' + hashTags[Math.floor(Math.random() * hashTags.length)] + 

	tweet += ' #' + ticker;
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
	  	var date = new Date();
	  	var dayOfWeek = date.getDay();
	  	var hour = date.getHours();
	  	if (dayOfWeek < 6 && hour > 6 && hour < 19) {
	  		tradingHours(data,ticker);
	  	} else {
	  	}
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	})
}

function timedStockRequest(){
	tickerArr = functionality.shuffleArray(tickerArr);
	stockQuery(tickerArr[0]);
	var i = 1;
	setInterval(function(){
		if (i == tickerArr.length){
			i = 0;
		}
		stockQuery(tickerArr[i]);
		i++;
	}, randomFrequency(tweetFrequency))
}

timedStockRequest();