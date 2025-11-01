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

	// function made to separate the catergorized tweets
	function filter_categorized_tweets(event_type){
		return tweet_array.filter(t => t.source === event_type);
	}
	
	// length of the total tweets 
	const TOTAL_NUM_TWEETS = tweet_array.length;

	// getting the length of each of the catergorized tweets 
	const COMPLETED_TWEETS = filter_categorized_tweets("completed_event");
	//console.log(COMPLETED_TWEETS)
	const NUM_COMPLETED_TWEETS = filter_categorized_tweets("completed_event").length;
	const NUM_LIVE_TWEETS = filter_categorized_tweets("live_event").length;
	const NUM_ACHIEVE_TWEETS = filter_categorized_tweets("achievement").length;
	const NUM_MISCELL_TWEETS =  filter_categorized_tweets("miscellaneous").length;

	// calculating the percentage for categorized tweeets and into decimal points
	function tweet_calculation(tweet_count){
		return math.format((tweet_count / TOTAL_NUM_TWEETS) * 100, {notation: 'fixed', precision: 2});
	}
	

	// the percentages of the catergorized tweets
	const PERC_COMP_TWEETS = tweet_calculation(NUM_COMPLETED_TWEETS);
	const PERC_LIVE_TWEETS = tweet_calculation(NUM_LIVE_TWEETS);
	const PERC_ACHIEVE_TWEETS = tweet_calculation(NUM_ACHIEVE_TWEETS);
	const PERC_MISCELL_TWEETS = tweet_calculation(NUM_MISCELL_TWEETS);

	// formatting the percentages and number of tweets 
	function formatting_percentages_and_tweets (num_class, num_tweet, percentage_class, percentage_tweet){
		document.querySelector(num_class).innerText = num_tweet
		document.querySelector(percentage_class).innerText = `${percentage_tweet}%`;
	}
	
	// this makes the completed tweets total number into both of the instances the class completedEvents is used
	document.querySelectorAll('.completedEvents').forEach(el => {el.innerText = NUM_COMPLETED_TWEETS});
	document.querySelector('.completedEventsPct').innerText = `${PERC_COMP_TWEETS}%`;
	
	// actual use of formatting the other catergorized tweets 
	formatting_percentages_and_tweets('.liveEvents', NUM_LIVE_TWEETS, '.liveEventsPct', PERC_LIVE_TWEETS);
	formatting_percentages_and_tweets('.achievements', NUM_ACHIEVE_TWEETS, '.achievementsPct', PERC_ACHIEVE_TWEETS);
	formatting_percentages_and_tweets('.miscellaneous', NUM_MISCELL_TWEETS, '.miscellaneousPct', PERC_MISCELL_TWEETS);
	
	

	// length of completed tweets with  writing  
	const WRITTEN_TWEETS = tweet_array.filter(t => t.written).length;
	const WRTTN_TWTS_PERC = math.format((WRITTEN_TWEETS / COMPLETED_TWEETS.length) * 100, {notation: 'fixed', precision: 2});
	 
	// formatting the written tweets
	formatting_percentages_and_tweets('.written', WRITTEN_TWEETS, '.writtenPct', WRTTN_TWTS_PERC);

}	

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});