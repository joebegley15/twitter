const Twit = require('twit');
const config = require('./config');
const bot = new Twit(config);

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

module.exports.postTweet = postTweet;