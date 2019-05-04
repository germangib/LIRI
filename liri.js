/* --------------------------
    Application Name:       LIRI
    Developer:              German Garcia  
    Date of last upd:       May 3, 2019

    Purpose:            Create application to xxxxxxx
*/

require("dotenv").config();

// Packages 
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var Spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

// --------------
// Global Variables
var text = process.argv.slice(2);
var outputLog = text.join(' ');
var command = process.argv[2]; 
var userQuestion = process.argv.slice(3); 
var outputLog = []; 

// -----------------------
// Functions section 
// -----------------------

function spotifySearch(){
    console.log("Entering spotifySearch...");


    console.log("finishing spotifySearch");
}

function concertSearch(){
    console.log("Entering concertSearch...");


    console.log("finishing concertSearch");
}

function movieSearch(){
    console.log("Entering movieSearch...");


    console.log("finishing movieSearch");
}

function doWhatItSays(){
    console.log("Entering doWhatItSays...");


    console.log("finishing doWhatItSays");
}

// ----------------------
// Main logic
// ----------------------
console.log("text: " + text);
console.log("command: " + command);
console.log("userQuestion: " + userQuestion); 

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

