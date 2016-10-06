"use strict";

/* Classes */
const Game = require('./game');
const EntityManager = require('./entity-manager');
const Pipe = require('./pipe');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 64);
var pipes = [];
var waterPipes=[];
var image = new Image();
image.src = 'assets/pipes.png';
var increment = 0;
var startPipe = new Pipe({x:64,y:64},"end-pipe",16);
startPipe.state="static";

waterPipes.push(startPipe);
entities.addEntity(startPipe);
var pipeType = ["4-pipe","2-pipe","2-pipe-90","2-pipe","2-pipe-90","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","3-pipe"];



canvas.oncontextmenu = function() {
     return false;  
} 


canvas.onclick = function(event) {
  event.preventDefault();
  switch(event.which){
		case 1:
			var x = parseInt(event.clientX)-12;
			var y = parseInt(event.clientY)-16-64;
			var index = entities.getIndex(x,y);
			if(entities.checkEntity(index) == -1) {
				var x2 = (index%15) * 64;
				var y2 = Math.floor(index/15) * 64;
				var randomPipe = pipeType[Math.floor(Math.random()*pipeType.length)];
				pipes.push(new Pipe({x:x2, y:y2}, randomPipe,parseInt(index)));
				entities.addEntity(new Pipe({x:parseInt(x), y:parseInt(y)},randomPipe ));
			}
			else if(entities.checkEntity(index) == 1) {
				var x2 = (index%15) * 64;
				var y2 = Math.floor(index/15) * 64;
				pipes.forEach(function(pipe, i){
					if(pipe.state != "static"){
						if(index==pipe.index){
							switch(pipe.rotate){
								case "0":
									pipe.rotate="90";
									break;
								case "90":
									pipe.rotate="180";
									break;
								case "180":
									pipe.rotate="270";
									break;
								case "270":
									pipe.rotate="0";
									break;
							}
						}
					}
				});
			}
			
			break;
		case 2:
			var x = parseInt(event.clientX)-12;
			var y = parseInt(event.clientY)-16-64;
			var index = entities.getIndex(x,y);
			
			break;
		default:
			window.alert("k");
			break;
  }
  // TODO: Place or rotate pipe tile
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
	
	
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);

}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
  if(increment==50){
	  waterPipes.forEach(function(pipe, i){
		  if(pipe.state=="empty" || pipe.state=="static"){
		  pipe.state="semi-full";
	  }
	  else if(pipe.state=="empty" || pipe.state=="static"){
		pipe.state="semi-full";
		}
		else{
			pipe.state="full";
			var flow = pipe.getFlow();
			if(flow.down==true && pipe.index > 14){
				pipes.forEach(function(pipe2, i){
					if(pipe2.index==pipe.index+15){
						waterPipes.push(pipe2);
						pipes.splice(i,1);
					}
				});
			}
			
		}
	  });
	  
	  
	  
		increment=0;
  }
  pipes.forEach(function(pipe, i){
		pipe.update(elapsedTime);
	});
	waterPipes.forEach(function(pipe, i){
		pipe.update(elapsedTime);
	});
  increment++;
}


/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO: Render the board
	entities.renderCells(ctx);
	waterPipes.forEach(function(pipe, i){
		pipe.render(elapsedTime,ctx);
	});
	pipes.forEach(function(pipe, i){
		pipe.render(elapsedTime,ctx);
	});
}


function getXandY(){
	var yes = canvas.onclick = function(event) {
	event.preventDefault();
	var x = parseInt(event.clientX)-12;
	var y = parseInt(event.clientY)-16-64;
	return {x:parseInt(x), y:parseInt(y)};
}

}
window.onkeydown = function(event)
{
	event.preventDefault();
	switch(event.keyCode)
	{
		case 82:
			
			break;
	}
}
