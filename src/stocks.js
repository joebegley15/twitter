var bot = require('./bot');
var postTweet = bot.postTweet;
var https = require('https');
var tweetFrequency = 600000;

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
		tweet = symbol + ' is ' + upDwn + '$' + change + ' (' + pctDay + '%) ' + sentenceEnders[Math.floor(Math.random() * sentenceEnders.length)] + '.';
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
	  	var date = new Date();
	  	var dayOfWeek = date.getDay();
	  	var hour = date.getHours();
	  	if (dayOfWeek < 6 && hour > 6 && hour < 19) {
	  		priceChange(data);
	  	}
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	})
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function timedStockRequest(){
	tickerArr = ['SQ','NKE','SHAK','MCD','SBUX','YUM','LUV','DIS','BAC','COF','CGNX','SNAP','NVDA','GOOG','BABA','MSFT','BRK.A','AAPL','SHOP','AMZN','TWTR','FB','F','TSLA','NFLX','BA','P'];
	tickerArr = shuffleArray(tickerArr);
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