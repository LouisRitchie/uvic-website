/* music-player.js
simple text-based music player.
author: Louis Ritchie
March 16th-17th, 2016

NOTE this is plain Node.js, no jquery, no date packages
*/

var interval, div, prev, play, pause, next, stop;
// grabbing html elements from the DOM - May be improved with jquery
about = document.getElementById("about");
timer = document.getElementById("timer");
prev = document.getElementById("prev");
play = document.getElementById("play");
pause = document.getElementById("pause");
next = document.getElementById("next");
stop = document.getElementById("stop");
shuffle = document.getElementById("shuffle");
add = document.getElementById("add");
songList = document.getElementById("songList");

// Initial event listeners for adding songs, starting playback.
play.addEventListener("click", _handlePlay);
shuffle.addEventListener("click", _handleShuffle);
add.addEventListener("click", _handleAdd);

// moment.js might do a better job of managing times - for now we Date array
var times = [];

// global variable `i` will keep track of what song we're on,
// `paused` boolean will keep track of pause/play state
var i; 
var paused = true;

// test data - pre-filled arrays of songs and song lengths (2 arrays) 
var songs = new Array();
var lengths = new Array();
var originalSongs = new Array();
var originalLengths = new Array();
// begins playing songs as they are ordered in the list.
function init() 
{
	// we must convert the lengths to their equivalent in ms.
	lengths = lengths.map(function timesBy1000(length) 
	{
		return length = length * 1000;
	});
	
	times[0] = times[1] = new Date().getTime();
	times[2] = 0;
	interval = setInterval(playing, 1000);
	paused = false;
	// adding event handlers to buttons except play.
	prev.addEventListener("click", _handlePrev);	
	pause.addEventListener("click", _handlePause);
	next.addEventListener("click", _handleNext);
	stop.addEventListener("click", _handleStop);
	i = 0;
}

function reset()
{
	clearInterval(interval);
	prev.removeEventListener("click", _handlePrev);	
	pause.removeEventListener("click", _handlePause);
	next.removeEventListener("click", _handleNext);
	stop.removeEventListener("click", _handleStop);
	i = null; // next press of play button will trigger init()
	about.innerHTML = "";
	timer.innerHTML = "";
}

/* playing()
Writes current song time, song info to html every second
contains the logic to go to the next song on song end.
*/
function playing() 
{
	times[1] = new Date().getTime();
	var seconds = times[1] - times[0];
	if(lengths[i] - 200 < seconds) { // handles song change at end of song.
		changeSong("next");
		times[0] = times[1] = new Date().getTime(); 
		seconds = 0;
		about.innerHTML = songs[i];
		writeTimeToHTML(seconds);
	}
	else {
		about.innerHTML = songs[i];	
		writeTimeToHTML(seconds);
	}
}

/* writeTimeToHTML()
formats the time into seconds:ms.
*/
function writeTimeToHTML(t) 
{	
	t = t + 900; // This is another symptom of how hackish this really is.
        output = Math.floor(t/1000);
        output = [(Math.floor(output/60)).toString(), (output%60).toString()];
	if (output[1].length == 1) {
		output[1] = "0" + output[1]
	} 
        timer.innerHTML = output[0].toString() + ":" + output[1].toString()
}

/* changeSong(str)
increments the global variable `i` depending on str parameter & current `i`
*/
function changeSong(str) 
{
	switch (str) {
		case "next":
			i++;
			i = i % songs.length;
			break;
		case "prev":
			i--
			if (i == -1) {
				i = songs.length - 1;
			}
			break;
		default:
			break;
	}
	about.innerHTML = songs[i];
}

// Grabbed from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) 
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/***

Handlers for all five buttons: prev, play, pause, next, and stop.

***/
function _handleAdd() 
{
	var song = document.getElementById("addSong");
	var length = document.getElementById("addLength");
	
	// write the songs to songList
	songList.innerHTML += song.value + " - " + length.value + "<br>";
		
	originalSongs.push(song.value);
	var l = length.value.split(":");
	var t = Number(l[0]) * 60 + Number(l[1]);
	originalLengths.push(t);
	console.log(songs, lengths)
}

function _handlePrev() 
{
	times[1] = times[0] = times[2] = new Date().getTime();
	var seconds = times[1] - times[0];
	if (seconds < 1200) { // if we just hit prev a second ago, goto prev
		changeSong("prev");
	}
	seconds = 0;
	writeTimeToHTML(seconds);
}

function _handlePlay() 
{	
	if (originalSongs.length < 1 || originalLengths.length < 1) {
		about.innerHTML = "Please enter songs first."
		return;
	}
	if (i == null) { // if init() has not been called we call it here.
		songs = originalSongs.slice();
		lengths = originalSongs.slice();
		init()
	}
	if (paused) {
		// here we add total time paused to times[0]
		times[1] = new Date().getTime()
		times[0] += times[1] - times[2];
		interval = setInterval(playing, 1000);
		paused = false;
	} 
	else {
		// do nothing - already playing
	}
}

function _handlePause() 
{
	if (paused) {
		// do nothing - already paused
	}
	else {
		clearInterval(interval);
		times[2] = new Date().getTime();
		paused = true;
	}
}

function _handleNext() 
{	
	changeSong("next");
	times[1] = times[0] = times[2] = new Date().getTime();
	seconds = 0;
	writeTimeToHTML(seconds)
}

function _handleStop() 
{
	reset()
}

function _handleShuffle() 
{
	if (originalSongs.length < 1 || originalLengths.length < 1) {
		about.innerHTML = "Please enter songs first."
		return;
	}
	if (i == null) { // if init() has not been called we call it here.
		var j, k;
		var temp = [];
		temp = originalSongs.slice();
		temp = shuffleArray(temp);
		var tempLengths = [];
		for (j = 0; j < songs.length; j++) {
			k = temp.indexOf(songs[j]);
			tempLengths[k] = originalLengths[j]
		}
		songs = temp;
		lengths = tempLengths;
		init()
	}
	else {
		// do nothing - already playing
	}
}
