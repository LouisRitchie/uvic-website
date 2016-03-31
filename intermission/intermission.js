// intermission.js
// stops and starts a stopwatch on a button click
// maintains the time of start and stop at the millisecond level.
// author: Louis Ritchie 
// LouisRitchie@github.com
// March 16th

var times = [];
/* times array. All times in ms since epoch.
	element:	represents:
	0		time at initialization + time spent paused
	1		current time
	2		time of last pause	
	3		time of last resume
*/
var interval, paused, button, div;

paused = false;
button = document.getElementsByTagName("button")[0];
reset = document.getElementsByTagName("button")[1];
div = document.getElementById("timer");
markZone = document.getElementsByTagName("h6")[0];

button.addEventListener("click", init);

/* init()
set initial times, switch button click handlers
*/
function init() 
{
	times[0] = times[1] = new Date().getTime();
	times[2] = 0;
	button.removeEventListener("click", init);
	button.addEventListener("click", pauseHandler);
	button.innerHTML = "Pause";
	reset.addEventListener("click", resetHandler);
	interval = setInterval(resume, 37)
}

/* pauseHandler()
either begin or resume & manage times
*/
function pauseHandler() 
{
	clearInterval(interval);
	times[1] = new Date().getTime();
	if (paused) {
		times[0] += times[1] - times[2];
		interval = setInterval(resume, 37);
	} else {	
		times[2] = times[1];
	}
	paused = !paused;		
	button.innerHTML = paused ? "Resume" : "Pause"
}

/* resetHandler()
Return everything to the starting state
*/
function resetHandler() 
{
	clearInterval(interval);
	paused = false;
	div.innerHTML = "0:000";
	markZone.innerHTML = "";
	button.innerHTML = "Start";
	button.removeEventListener("click", pauseHandler);
	button.addEventListener("click", init);
}
/* resume()
call by setInterval() in pauseHandler(), writes the time to HTML.
*/
function resume() 
{
	times[1] = new Date().getTime();
	writeTimeToHTML(times[1] - times[0])
	if (((times[1] - times[0]) % 5000 > 0 && (times[1] - times[0]) % 5000 <= 37) || (markZone.innerHTML == "")) {
		markZone.innerHTML += "mark!\n"
	}
}

/* writeTimeToHTML
formats the time into seconds:ms.
*/
function writeTimeToHTML(t) {
        output = (t/1000).toString().split(".");
        output[1] = output[1] == null ? 0 : output[1];
        while (output[1].length < 3) {
        	output[1] += "0"
        }
        div.innerHTML = output[0] + ":" + output[1]
}
