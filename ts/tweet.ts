class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

    // made this private array so that it can be used throughout getters and then 
    // have that be used when parsing the tweets for the automated/default phrases
    private AUTO_PHRASES: (string | RegExp)[] = [
        /https?:\/\/\S+/g, // rid of the link 
        "just completed a", // starter phrases
        "just posted a", 
        "just set a goal",
        "achieved a new personal record", 
        "completed", 
        "watch my",
        "with Runkeeper.",
        /#FitnessAlerts/gi, // hashtags 
        /#RunKeeper/gi,
        /#RKLive/gi,
        "check it out!", // other
        "with @runkeeper.", 
        "elliptical workout",
        "nordic", // removing these in order to have same length for automated 
        "mtn",
        "ski",
        "- tomtom mysports watch", // extra
        "right now live", 
        "workout in", 
        "mysports freestyle",
        
        
    ];

    // this filters some but not all the phrases out and replaces them with '' and returns the
    // new stripped tweet
    private filtering_phrases_out(): string {
        let STRIPPED_TWT = this.text.toLowerCase().trim();
       
        this.AUTO_PHRASES.forEach((phrase) => {
            if (phrase instanceof RegExp){
                STRIPPED_TWT = STRIPPED_TWT.replace(phrase, "");
            } else {
                STRIPPED_TWT = STRIPPED_TWT.replace(new RegExp(phrase, "gi"), "");
            }
            });   
        return STRIPPED_TWT;
        }
        
	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const TWEET_TXT = this.text.toLowerCase().trim();

        if (TWEET_TXT.startsWith("just completed") || 
            TWEET_TXT.startsWith("just posted") || 
            TWEET_TXT.startsWith("just finished") || TWEET_TXT.startsWith("completed")) {
            return "completed_event";
        } else if (TWEET_TXT.startsWith("achieved")) {
            return "achievement";
        } else if (TWEET_TXT.startsWith("watch my") && TWEET_TXT.includes("right now")) {
            return "live_event";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const cleanText = this.filtering_phrases_out().trim().split(/\s+/);
        return cleanText.length > 3 && cleanText[cleanText.length - 1] !== '-';
        // if true length is > 3 then there is extra user writing 
        // else if false no extra
        // the use of checking if '-' is last element is due to 
        // format of different user's activity type, time and distance (ie. '3 km walk -')
    }

    get writtenText():string {
        //*****TODO: by gen - need to make the stripped in written() into function so i can use it here too.
        if(!this.written) {
            return "";
        }
        // parses the tweet
        const notFullyCleanedText = this.filtering_phrases_out()
        
        // checks if there is a dash present 
        const findingDashIndex = notFullyCleanedText.indexOf('-')

        // if dash is present, then the tweet takes of the dash and everything prior to it
        if (findingDashIndex !== -1) {
            const takingOffDashAndPrior = notFullyCleanedText.slice(findingDashIndex + 1).trim();
            return takingOffDashAndPrior;            
        } else {
            return notFullyCleanedText;

        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        
        // array for detailed activity
        const SPECIFIC_ACTIVITIES = [
            "mtn bike",
            "nordic walk", 
            "ski run", 
            "chair ride", 
        ]
        
        // array for the common activites 
        const REG_ACTIVITIES = [
            "bike", 
            "run", 
            "walk", 
            "activity", 
            "hike", 
            "swim", 
            "row"
        ]
 
        // getting the splitting the tweets in array of strings
        let completed_tweets = this.text.trim().split(/\s+/);
        
        // checking the index of array in which the word km/mi is detected
        const distanceIndex = completed_tweets.findIndex(word => word === "km" || word === "mi");
        
        // if distanceIndex exists 
        if (distanceIndex !== -1) {
            // used for regular one word activities 
            // hence the plus 1 in order to see the next element 
            const compRegActiveType = completed_tweets[distanceIndex + 1] || "";

            // used for specific activites, which have two words
            // thus making us join the next 2 elements from the distance 
            const compSpecActiveType = [compRegActiveType, completed_tweets[distanceIndex + 2]].join(" ").trim()
            
            // checking which activties there are that match the const arrays 
            //  and returning the string of activity types 
            if (REG_ACTIVITIES.some(activity => compRegActiveType === activity)) {
                return compRegActiveType + "_activity"
            } else if (SPECIFIC_ACTIVITIES.some(activity => compSpecActiveType === activity)) {
                return compSpecActiveType.replace(" ","_") + "_activity";
            }
        }
        return "other"; 
    }


    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet
        let dist_completed_tweets = this.text.trim().split(/\s+/);
        const findDistanceTypeIndex = dist_completed_tweets.findIndex(word => word === "km" || word === "mi");
        
        // makes sure that km/mi is present so that we are only using that type of distance
        // and not duration 
        if (findDistanceTypeIndex !== -1) { 
            const actualNumDistance = Number(dist_completed_tweets[findDistanceTypeIndex - 1] || 0);
            
            // getting the km distances and converting to miles
            if (dist_completed_tweets[findDistanceTypeIndex] === "km") {
                let kmCovertedToMiles = Number((actualNumDistance / 1.609).toFixed(2));
                return kmCovertedToMiles;
            } else if (dist_completed_tweets[findDistanceTypeIndex] === "mi") {
                return actualNumDistance;
                // returning the mile distance
            }
            return 0;
        }
         return 0; 
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const tweetHTML = this.text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        ); 

        return `
        <tr>
            <td>${rowNumber}</td>
            <td>${this.activityType.replace("_activity","").replace("_", " ")}</td>
            <td>${tweetHTML}</td>
        </tr>
        `;
    }
}