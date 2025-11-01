function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	// lengths of the different activity types
	function countingActivityTypes() {
		const count = {};

		tweet_array.forEach(tweet => {
			const type = tweet.activityType;
			if (count[type]) {
				count[type] += 1;
			} else {
				count[type] = 1;
			}
		});

		return count;
	};
	
	// getting the total different activities and DOM manipluating to HTML file
	const numOfDiffActivities = Object.keys(countingActivityTypes()).length;
	document.getElementById("numberActivities").innerText = numOfDiffActivities;

	// getting the top three activites with the amount the activities returned
	// also have the underscores removed and '_activity' removed in order to format for DOM manipluation 
	function topThreeActivites() {
		const count = countingActivityTypes();
		return Object.entries(count).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => ({type: name.replace("_activity", "").replace(/_/g, " "), count}));
	};
	const theThreeActivites = topThreeActivites().map(a => a.type);
	
	document.getElementById("firstMost").innerText = theThreeActivites[0];
	document.getElementById("secondMost").innerText = theThreeActivites[1];
	document.getElementById("thirdMost").innerText = theThreeActivites[2];

	function returnCleanedTypes(tweet) {
		const cleanType = tweet.activityType.replace("_activity", ""). replace(/_/g, " ");
		return cleanType;
	}
	
	// getting all distances of the top 3 
	const distOfTopThree = {};
	theThreeActivites.forEach(activity => {
		const tweetsofTypes = tweet_array.filter(t => returnCleanedTypes(t) === activity);
		distOfTopThree[activity] = tweetsofTypes.map(t => t.distance).filter(d => d > 0);
	});

	// averages of the top 3 activities 
	const avgDist = {};
	for (const activity in distOfTopThree) {
		const distances = distOfTopThree[activity];
		const total = distances.reduce((sum, d) => sum + d, 0);
		const aver = distances.length > 0 ? total / distances.length : 0; 
		avgDist[activity] = Number(aver.toFixed(2));
	}

	// longest and shortest distance 
	const sortedDistAvg = Object.entries(avgDist).sort((a,b) => b[1] - a[1]);
	const longestTypeDist = sortedDistAvg[0][0];
	const shortestTypeDist = sortedDistAvg[2][0];
	
	document.getElementById('longestActivityType').innerText = longestTypeDist;
	document.getElementById('shortestActivityType').innerText = shortestTypeDist;

	// use top 3 averages then see if they done more on the weekend or not
	function onWeekend(date) {
		const day = new Date(date).getDay();
		return day === 0 || day === 6;
	}
	
	// based on each activity counting how many were done on weekend and weekday
	const top3DaysWkDayWkEndDist = {};
	theThreeActivites.forEach(activity => {
		const tweetsofTypes = tweet_array.filter(t => returnCleanedTypes(t) === activity && t.distance > 0);
		
		const wkDayTwts = tweetsofTypes.filter(t => !onWeekend(t.time));
		const wkEndTwts = tweetsofTypes.filter(t => onWeekend(t.time));

		// getting the average distance for both 
		const wkDayAvgDist = wkDayTwts.length > 0 ? wkDayTwts.reduce((sum, t) => sum + t.distance, 0) / wkDayTwts.length : 0;
		const wkEndAvgDist = wkEndTwts.length > 0 ? wkEndTwts.reduce((sum, t) => sum + t.distance, 0) / wkEndTwts.length : 0;
		top3DaysWkDayWkEndDist[activity] = {
			weekday: wkDayAvgDist,
			weekend: wkEndAvgDist
		};
	});


	// combining averages of 3 activities
	let allWkDayCombined = Object.values(top3DaysWkDayWkEndDist).map(a => a.weekday);
	const allWkEndCombined = Object.values(top3DaysWkDayWkEndDist).map(a => a.weekend);

	// average weekend and weekday between all 3 activites
	avgWkDay = allWkDayCombined.reduce((sum, val) => sum + val, 0) / allWkDayCombined.length;
	avgWkEnd = allWkEndCombined.reduce((sum, val) => sum + val, 0) / allWkEndCombined.length;

	// inputs respective word depending which average is greater
	if (avgWkDay > avgWkEnd) {
		document.getElementById("weekdayOrWeekendLonger").innerText = "weekdays";
	} else {
		document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";
	};


	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const valuesForGraphData = tweet_array.map(t => ({
		activityType: returnCleanedTypes(t)
	})); 

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": valuesForGraphData
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar", 
	  "encoding": {
		"x": {
			"field": "activityType",
			"type": "nominal",
			"title": "Activity Type", 
			"sort": "-y" // sort in descending order
		},
		"y": {
			"aggregate": "count", 
			"type": "quantitative", 
			"title": "Number of Tweets"
		}
	  }

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	// used to get the order of the x values in last two graphs correctly sorted 
	const weekOrder = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"]
	
	const dayOfWkData = tweet_array.filter(t => t.distance > 0 && theThreeActivites.includes(returnCleanedTypes(t)))
	.map( t => ({
		activityType: returnCleanedTypes(t),
		distance: t.distance, 
		day: weekOrder[new Date(t.time).getDay()]
	})); 

	const dist_by_day_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Toggle between raw distances and mean distances",
		"data": { "values": dayOfWkData },
		"params": [
			{
				"name": "aggregateToggle",
				"value": false
			}
		],
		"transform": [
			{
				"joinaggregate": [
					{ "op": "mean", "field": "distance", "as": "meanDistance" }
				],
				"groupby": ["activityType", "day"]
			},
			{
				// dynamically switch the field being shown
				"calculate": "aggregateToggle ? datum.meanDistance : datum.distance",
				"as": "displayDistance"
			}
		],
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "nominal",
				"title": "Time (day)",
				"sort": weekOrder
			},
			"y": {
				"field": "displayDistance",
				"type": "quantitative",
				"title": { "expr": "aggregateToggle ? 'Mean of distance (mi)' : 'Distance'" }
			},
			"color": {
				"field": "activityType",
				"type": "nominal"
			}
		}
	};

	vegaEmbed("#distanceVis", dist_by_day_spec, { actions: false }).then(result => {
		const vegaView = result.view;
		const toggleButton = document.getElementById("aggregate");

		let showingMean = false;

		toggleButton.addEventListener("click", async () => {
			showingMean = !showingMean;

			// update the parameter value
			await vegaView.signal("aggregateToggle", showingMean).runAsync();

			// update button text
			toggleButton.textContent = showingMean ? "Show all activities" : "Show means";
		});
	});
}



//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});