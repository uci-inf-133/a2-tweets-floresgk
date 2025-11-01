function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: Filter to just the written tweets
	
	tweet_array = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at));
	tweet_array = tweet_array.filter(tweet => tweet.writtenText && tweet.writtenText.length > 0);
   


}


function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchInp = document.getElementById("textFilter"); 
	const tableBody = document.getElementById("tweetTable"); 
	const searchCountSpan = document.getElementById("searchCount");
	const searchTextSpan = document.getElementById("searchText");

	searchInp.addEventListener("input", () => {
		const searchTerm = searchInp.value.trim().toLowerCase();
		// clear table and update count if empty search
		if (searchTerm === "") {
			tableBody.innerHTML = "";
			searchCountSpan.innerText = 0;
			searchTextSpan.innerText = "";
			return;
		}
		// matching written tweets to search term
		const filteredTweets = tweet_array.filter(tweet => 
			tweet.writtenText.toLowerCase().includes(searchTerm)
		);
		// getting the new term and number of tweets updated
		searchCountSpan.innerText = filteredTweets.length;
		searchTextSpan.innerText = searchTerm;
		tableBody.innerHTML = "";

		filteredTweets.forEach((tweet, index) => {
			const rowHTML = tweet.getHTMLTableRow(index + 1);
			tableBody.insertAdjacentHTML('beforeend', rowHTML);
		})
	});
}



//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});