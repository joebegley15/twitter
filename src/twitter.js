const Twit = require('twit');
const config = require('./config');
const bot = new Twit(config);
const my_user_name = config.userName;
const timeout = 1000 * 60 * 5; // timeout to send the message 5 min

function postTweet(tweet) {
	bot.post('statuses/update', {
	  status: tweet
	}, (err, data, response) => {
	  if (err) {
	    console.log(err)
	  } else {
	    console.log(`${data.text} tweeted!`)
	  }
	})
}

function slide(dm,handle){
	bot.post('direct_messages/new', {
	  screen_name: handle,
	  text: dm
	}, (err, data, response) => {
	  if (err) {
	    console.log(err)
	  } else {
	    console.log(data)
	  }
	})
}

function getFollowers(screenName) {
	bot.get('followers/list', {
	  screen_name: screenName,
	  count:200
	}, (err, data, response) => {
	  if (err) {
	    console.log(err)
	  } else {
	    data.users.forEach(user => {
	      console.log(user.screen_name)
	    })
	  }
	})
}

function dmFinancial(data,ticker,userName) {
	var dataObj = JSON.parse(data);
	var quote = dataObj['quote'];
	var news = dataObj['news'];
	var tweet = '';
	if (quote) {
		var name = quote['companyName'];
		var week52High = quote['week52High']; 
		var week52Low = quote['week52Low']; 
		var price = quote['latestPrice']; 
		var change = Math.round(quote['change'] * 100) / 100; 
		var symbol = quote['symbol']; 
		var previousClose = quote['previousClose'];
		var pctDay = Math.round(quote['changePercent'] * 10000) / 100;
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
		slide(tweet,'jdipi');
	}
}

module.exports.postTweet = postTweet;
module.exports.slide = slide;
module.exports.getFollowers = getFollowers;
module.exports.dm