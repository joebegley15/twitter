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

module.exports.postTweet = postTweet;
module.exports.slide = slide;