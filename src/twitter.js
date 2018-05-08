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

// const autoDM = () => {
//   const stream = Twit.stream("user");
//   console.log("Start Sending Auto Direct Message 🚀🚀🚀");
//   stream.on("follow", SendMessage);
// };

// const SendMessage = user => {
//   const { screen_name, name } = user.source;

//   const obj = {
//     screen_name,
//     text: GenerateMessage(name)
//   };
//   // the follow stream track if I follow author person too.
//   if (screen_name != my_user_name) {
//     console.log(" 🎉🎉🎉🎉 New Follower  🎉🎉🎉🎉🎉 ");
//     setTimeout(() => {
//       Twit.post("direct_messages/new", obj)
//         .catch(err => {
//           console.error("error", err.stack);
//         })
//         .then(result => {
//           console.log(`Message sent successfully To  ${screen_name}  💪💪`);
//         });
//     }, timeout);
//   }
// };

module.exports.postTweet = postTweet;
module.exports.slide = slide;
module.exports.getFollowers = getFollowers;
// module.exports.autoDM = autoDM;