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
var image = new Image();
image.src = 'assets/pipes.png';



canvas.onclick = function(event) {
  event.preventDefault();
  var x = parseInt(event.clientX)-12;
  var y = parseInt(event.clientY)-16-64;
  var index = entities.getIndex(x,y);
  if(entities.checkEntity(index) == -1) {
	  var x2 = (index%15) * 64;
	  var y2 = Math.floor(index/15) * 64
	  pipes.push(new Pipe({x:x2, y:y2}, "4"));
	  
	entities.addEntity(new Pipe({x:parseInt(x), y:parseInt(y)}, "4"));
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

  console.log(pipes.length);
  // TODO: Render the board
	entities.renderCells(ctx);
	pipes.forEach(function(pipe, i){
		pipe.render(elapsedTime,ctx);
	});
}
