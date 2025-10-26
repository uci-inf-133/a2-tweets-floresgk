function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	
	// getting all of the tweet dates
	let dates = tweet_array.map(tweet => tweet.time);
	
	// getting the earliest and latest date from all the dates
	let earliest_date = new Date(Math.min(...dates));
	let latest_date = new Date(Math.max(...dates));


	// making the dates for the about page formatted into proper way
	function format_date(tweet_date) {
		return tweet_date.toLocaleDateString('en-US', {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	};
	
	// actual formatted dates 
	const FORMATTED_EARLY_DATE = format_date(earliest_date);
	const FORMATTED_LATE_DATE = format_date(latest_date);

	// dom manipulating for actual dates formatted
	document.getElementById('firstDate').innerText = FORMATTED_EARLY_DATE;
	document.getElementById('lastDate').innerText = FORMATTED_LATE_DATE;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});