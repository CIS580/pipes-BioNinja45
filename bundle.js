(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			console.log(index);
			if(entities.checkEntity(index) == -1) {
				var x2 = (index%15) * 64;
				var y2 = Math.floor(index/15) * 64;
				var randomPipe = pipeType[Math.floor(Math.random()*pipeType.length)];
				console.log(randomPipe);
				pipes.push(new Pipe({x:x2, y:y2}, randomPipe,parseInt(index)));
				entities.addEntity(new Pipe({x:parseInt(x), y:parseInt(y)},randomPipe ));
			}
			else if(entities.checkEntity(index) == 1) {
				var x2 = (index%15) * 64;
				var y2 = Math.floor(index/15) * 64;
				pipes.forEach(function(pipe, i){
					if(pipe.state != "static"){
						if(index==pipe.index){
							pipe.rotateFlow();
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
			if(flow.up==true && pipe.index > 14){
				pipes.forEach(function(pipe2, i){
					if(pipe2.index==pipe.index+15){
						var flow2= pipe2.getFlow();
						if(flow.up==true){
							waterPipes.push(pipe2);
							pipes.splice(i,1);
						}
						else{
							gameOver();
						}
					}
				});
			}
			else if(flow.down==true && pipe.index < 180){
				pipes.forEach(function(pipe2, i){
					if(pipe2.index==pipe.index-15){
						var flow2= pipe2.getFlow();
						if(flow.up==true){
							waterPipes.push(pipe2);
							pipes.splice(i,1);
						}
						else{
							gameOver();
						}
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
function gameOver(){}

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

},{"./entity-manager":2,"./game":3,"./pipe":4}],2:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.getIndex = function(x,y){
var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  if(this.cells[index].length ==0){
	  this.cells[index].push(entity);
	  entity._cell = index;
  }
}

EntityManager.prototype.checkEntity= function(index){
	if(this.cells[index].length==0){
		return -1;
	}
	return 1;
}

EntityManager.prototype.renderCells = function(ctx) {
  for(var x = 0; x < this.widthInCells; x++) {
    for(var y = 0; y < this.heightInCells; y++) {
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
  }
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Pipe class
 */
module.exports = exports = Pipe;

var flow  = {
	up:false,
	right:false,
	down:false,
	left:false
}

/**
 * @constructor Pipe
 * Creates a new Pipe object
 * @param {Postition} position object specifying an x and y
 */
function Pipe(position,type,index) {
  this.state = "empty";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.type = type;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/' + this.type + '.png');
  this.translateX = 0;
  this.translateY = 0;
  this.rotate = "0";
  this.index = index;
  this.frame = 0;
  switch(this.type){
	case "2-pipe-90":
		flow.down=true;
		flow.up=false;
		flow.right=true;
		flow.left=false;
		break;
	case "2-pipe":
		flow.left=true;
		flow.right=true;
		flow.down=false;
		flow.up=false;
		break;
	case "4-pipe":
		flow.left=true;
		flow.right=true;
		flow.up=true;
		flow.down=true;
		break;
	case "3-pipe":
		flow.left=true;
		flow.right=true;
		flow.down=true;
		flow.up=false;
	default:
		break;
  }
}

/**
 * @function updates the Pipe object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pipe.prototype.update = function(elapsedTime) {
	if(this.state=="empty"){
		
		
		switch(this.rotate){
			case "0":
				this.translateX = 0;
				this.translateY = 0; 
				break;
			case "90":
				this.translateX = 64;
				this.translateY = 0;
				break;
			case "180":
				this.translateX=64;
				this.translateY=64;
				break;
			case "270":
				this.translateX=0;
				this.translateY=64;
				break;
		}
	}
	else if(this.state=="semi-full"){
		this.frame=1;
	}
	else if(this.state=="full"){
		this.frame=2;
	}
}
Pipe.prototype.getFlow=function(){
	return flow;
}

Pipe.prototype.rotateFlow=function(){
	var flow2 = {
			up:false,
			right:false,
			down:false,
			left:false
		} 
		if(this.type!="2-pipe"){
			if(flow.right==true){
				flow2.down=true;
			}
			if(flow.down==true){
				flow2.left=true;
			}
			if(flow.left==true){
				flow2.up=true;
			}
			if(flow.up==true){
				flow2.right=true;
			}
		}
		else{
			if(flow.right==true){
				flow2.left=true;
			}
			if(flow.down==true){
				flow2.up=true;
			}
			if(flow.left==true){
				flow2.right=true;
			}
			if(flow.up==true){
				flow2.down=true;
			}
		}
		console.log(flow);
		console.log(flow2);
		flow = flow2;
		
}


/**
 * @function renders the Pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Pipe.prototype.render = function(time, ctx) {
	
	ctx.save();
	ctx.translate(this.x+this.translateX,this.y+this.translateY);
	ctx.rotate(this.rotate * Math.PI / 180);
	
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    32*this.frame, 0, 32, 32,
    // destination rectangle
    0, 0, this.width, this.height
  );
  ctx.restore();
  ctx.strokeStyle = this.color;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
}

},{}]},{},[1]);
