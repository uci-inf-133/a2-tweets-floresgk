class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
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
        
          //  return "unknown";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}