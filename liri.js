/* --------------------------
    Application Name:       LIRI
    Developer:              German Garcia  
    Date of last upd:       May 5, 2019

    Purpose:        Create application to display songs, concerts, movies information
                    based on customer input.
    
    Usage: 
            node liri.js spotify-this-song [song name]
            node liri.js movie-this [movie name]
            node liri.js concert-this [artist name]
            node liri.js do-what-it-says
    Notes:
            - If no song entered on sopotify-this-song, a default is selected.
            - Not all movies have a rotten tomatos ratings. 
            - If do-what-it-says is entered, then the random.txt file is read and the
                command in the first line of the file is executed
            - A log file is created for each search with a timestamp.
*/

// Packages 
require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

// --------------
// Global Variables
var text = process.argv.slice(2);
var logText = text.join(' ');
var command = process.argv[2]; 
var searchPhrase = process.argv.slice(3); 
var outputLog = []; 

// get current date for log file:
var today = new Date();
var dd = today.getDate();
var mm = today. getMonth() + 1; // January is 0;
var yyyy = today.getFullYear(); 

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

var today = dd + '-' + mm + '-' + yyyy; 

// -----------------------
// Functions section 
// -----------------------

function spotifySearch(){
    console.log("Entering spotifySearch...");
    outputLog = [];
    outputLog.unshift(logText);
    outputLog.unshift(today);
    
/*  Information from spotify web api:
    search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback); 

    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    
    console.log(data); 
    });
*/
    // If no song is provided then your program will default to "The Sign" by Ace of Base. 
    // this is the base case as well

    if(process.argv.length === 3) {
        console.log("Searching for The Sign...");
        searchPhrase = "The Sign";

        /* spotify.search({type: 'track', query: searchPhrase, limit: 10, offset: 5 }, function(err, data){
            if(err) {
                return console.log('Error occurred: ' + err); 
            }
            console.log(data); 
        });
        */
       spotify.search({type: 'track', query: searchPhrase, limit: 20})
       .then(function(response) {
           console.log("\n\n");
           // Artist name
           console.log("Artist Name: " + response.tracks.items[10].album.artists[0].name); 
           outputLog.push("Artist Name: " + response.tracks.items[10].album.artists[0].name); 
           // Song
           console.log("Song: " + response.tracks.items[10].name); 
           outputLog.push("Song: " + response.tracks.items[10].name);
           // Preview
           console.log("Preview URL: " + response.tracks.items[10].preview_url);
           outputLog.push("Preview URL: " + response.tracks.items[10].preview_url);
           // Album Name:
           console.log("Album Name: " + response.tracks.items[10].album.name); 
           outputLog.push("Album Name: " + response.tracks.items[10].album.name) ;
            outputLog.push('\n');
           // Write information into log file:
           console.log("outputLog: ");
           console.log(outputLog); 
           writeLogFile(); 
           
       }).catch(function(err) {
           console.log(err);
           outputLog.push(err);
           outputLog.push('\n');
           writeLogFile();
       }); 
    } //if 
    else { // we are getting song name from the command line
        spotify.search({type: 'track', query: searchPhrase, limit: 1}).then(function(response){
            console.log("\n\n");
           // Artist name
           console.log("Artist Name: " + response.tracks.items[0].album.artists[0].name); 
           outputLog.push("Artist Name: " + response.tracks.items[0].album.artists[0].name); 
           // Song
           console.log("Song: " + response.tracks.items[0].name); 
           outputLog.push("Song: " + response.tracks.items[0].name);
           // Preview
           console.log("Preview URL: " + response.tracks.items[0].preview_url);
           outputLog.push("Preview URL: " + response.tracks.items[0].preview_url);
           // Album Name:
           console.log("Album Name: " + response.tracks.items[0].album.name); 
           outputLog.push("Album Name: " + response.tracks.items[0].album.name) ;
           outputLog.push('\n');
            // Write information into log file:
            console.log("outputLog: ");
            console.log(outputLog); 
            
            writeLogFile();

        }).catch(function(err){
            outputLog.push(err);
            console.log(err);
            outputLog.push('\n');
            writeLogFile();
        });

    }

    

    console.log("finishing spotifySearch");
} // End Spotify Search

function concertSearch(){
    console.log("Entering concertSearch...");
    outputLog = [];
    outputLog.unshift(logText);
    outputLog.unshift(today);

/*  from homework instructions: 

This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    Name of the venue
    Venue location
    Date of the Event (use moment to format this as "MM/DD/YYYY")
*/ 
    var tmpSearchStr = searchPhrase.join('%20');

    axios.get("https://rest.bandsintown.com/artists/" + tmpSearchStr + "/events?app_id=codingbootcamp")
        .then(function(response){
            
            //console.log(response.data[0].lineup[0]);
            var eventDate = response.data[0].datetime;

            //Artist:
            console.log("Artist: " + searchPhrase); 
            outputLog.push("Artist: " + searchPhrase);
            //Name of venue
            console.log("Name of venue: " + response.data[0].venue.name);
            outputLog.push("Name of venue: " + response.data[0].venue.name); 
            //Location
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            outputLog.push("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country); 
            //Date of event
            console.log("Date: " + moment(eventDate).format("MM/DD/YYYY"));
            outputLog.push("Date: " + moment(eventDate).format("MM/DD/YYYY"));
            outputLog.push('\n');
            // Write information into log file:
            writeLogFile();

            console.log("\n");
            console.log("outputLog: ");
            console.log(outputLog); 

        }).catch(function(err){
            console.log(err);
            outputLog.push(err);
            outputLog.push('\n');
            // Write information into log file:
            writeLogFile();
            
            console.log("outputLog: ");
            console.log(outputLog); 
        });

    console.log("finishing concertSearch");
} // End concert search

function movieSearch(){
    console.log("Entering movieSearch...");
    outputLog = [];
    outputLog.unshift(logText);
    outputLog.unshift(today);

    /* Instructions: 
        - Print to the terminal:
            * Title of the movie.
            * Year the movie came out.
            * IMDB Rating of the movie.
            * Rotten Tomatoes Rating of the movie.
            * Country where the movie was produced.
            * Language of the movie.
            * Plot of the movie.
            * Actors in the movie.
        - If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    */

    axios.get("http://www.omdbapi.com/?t=" + searchPhrase + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            console.log("Title: " + response.data.Title);
            outputLog.push("Title: " + response.data.Title);
            //Release Date
            console.log("Release Date: " + response.data.Released);
            outputLog.push("Release Date: " + response.data.Released);
            // IMDB Rating of the movie.
            console.log("Rating: " + response.data.imdbRating);
            outputLog.push("Rating: " + response.data.imdbRating);
            //Rotten Tomatoes Rating of the movie.
            if (response.data.Ratings.length != 0)   {
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
                outputLog.push("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            } else {
                console.log("No Rotten Tomatos");
            }
            //Country where the movie was produced.
            console.log("Country: " + response.data.Country);
            outputLog.push("Country: " + response.data.Country);
            //Language of the movie.
            console.log("Language: " + response.data.Language);
            outputLog.push("Language: " + response.data.Language);
            //Plot of the movie.
            console.log("Plot: " + response.data.Plot);
            outputLog.push("Plot: " + response.data.Plot);
            //Actors in the movie.
            console.log("Actors: " + response.data.Actors);
            outputLog.push("Actors: " + response.data.Actors);   
            outputLog.push('\n');
            // Write information into log file:
            writeLogFile();
            console.log("outputLog: ");
            console.log(outputLog); 

        }).catch(function(err){
            console.log(err);
            outputLog.push(err);
            outputLog.push('\n');
            // Write information into log file:
            writeLogFile();
            console.log("outputLog: ");
            console.log(outputLog); 
        });

    console.log("finishing movieSearch");
} // end movie search

function doWhatItSays(){
    console.log("Entering doWhatItSays...");

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
    
        var dataArray = data.split(",");

        command = dataArray[0];
        searchPhrase = dataArray[1];

        switch(command){
            case "spotify-this-song":
                spotifySearch();
                break;
            case "concert-this":
                // Remove quote characters:
                if (searchPhrase.charAt(0) === '"') {
                    searchPhrase = searchPhrase.substring(1).slice(0, -1); 
                    concertSearch();
                } else {
                    consertSearch();
                }
                break;
            case "movie-this":
                movieSearch();
                break;
            default:
                console.log ("Not a valid command: " + command); 
                break;
        }
    }); 
    console.log("finishing doWhatItSays");
} // end do what it says

// Function to write log file
function writeLogFile(){
    fs.appendFile ("log_" + today, outputLog, function(err){
        if(err) {
            console.log(err);
        }

        else {
            console.log("Output added to log file: log_" + today); 
        }
    });

}

// ----------------------
// Main logic
// ----------------------
console.log("command: " + command);
console.log("searchPhrase: " + searchPhrase); 

switch(command) {
    case "spotify-this-song":
        spotifySearch();
        break;
    case "concert-this":
        concertSearch();
        break;
    case "movie-this":
        movieSearch();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Invalid command");
}

