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
var score = 0;
var level = 1;
var image = new Image();
image.src = 'assets/pipes.png';
var increment = -900;
var incrementHit=100;
var startPipe = new Pipe({x:128,y:64},"end-pipe",17);
var endPipe = new Pipe({x:704,y:576},"end-pipe",146);
startPipe.state="static";
startPipe.time=-1;
endPipe.state="end";
pipes.push(endPipe);
waterPipes.push(startPipe);
pipes.push(startPipe);
entities.addEntity(startPipe);
entities.addEntity(endPipe);
var pipeType = ["4-pipe","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","2-pipe","2-pipe-90"];
var placeAudio = new Audio("assets/place.wav");
var rotateAudio = new Audio("assets/rotate.wav");
var loseAudio = new Audio("assets/lose.wav");
var winAudio = new Audio("assets/win.wav");
var myAudio = new Audio("assets/background_music.m4a");
myAudio.loop = true;
//myAudio.play();
var GameOver=false;
var randomPipeType = pipeType[Math.floor(Math.random()*pipeType.length)];
var randomPipe = new Pipe({x:896, y:0}, "4-pipe",14);
var randomPipes = [];
randomPipes.push(randomPipe);
entities.addEntity(randomPipe);
pipes.push(randomPipe);

canvas.oncontextmenu = function() {
     return false;  
} 


canvas.onclick = function(event) {
  event.preventDefault();
  if(GameOver==true) return;
  switch(event.which){
		case 1:
		
			var x = parseInt(event.clientX)-12;
			var y = parseInt(event.clientY)-16-64;
			var index = entities.getIndex(x,y);
			if(entities.checkEntity(index) == -1) {
				var x2 = (index%15) * 64;
				var y2 = Math.floor(index/15) * 64;
				randomPipes[randomPipes.length-1].x=x2;
				randomPipes[randomPipes.length-1].y=y2;
				randomPipes[randomPipes.length-1].index=index;
				pipes.push(randomPipes[randomPipes.length-1]);
				console.log(pipes[2].length);
				
				entities.addEntity(new Pipe({x:parseInt(x), y:parseInt(y)},randomPipe ));
				randomPipeType="";
				randomPipe=null;
				var randomPipeType2 = pipeType[Math.floor(Math.random()*pipeType.length)];
				randomPipe = new Pipe({x:896, y:0},randomPipeType2.toString(),14);
				randomPipes.push(randomPipe);
				pipes.forEach(function(pipe2, i){
					if(parseInt(pipe2).index==14){
						pipes.splice(i,1);
						pipes.push(randomPipes[randomPipes.length-1]);
					}
				});
				placeAudio.play();
			}
			else if(entities.checkEntity(index) == 1) {
				var x2 = (index%15) * 64;
				var y2 = Math.floor(index/15) * 64;
				pipes.forEach(function(pipe, i){
					if(pipe.state != "static" && pipe.state!="end"){
						
						if(parseInt(index)==parseInt(pipe.index)){
							
							pipe.rotateFlow();
							rotateAudio.play();
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
 if(GameOver==true)return;
  // TODO: Advance the fluid
  if(increment==10){
	  var check=true;
	  if(waterPipes[waterPipes.length-1].state=="end"){
		  victory();
	  }
	  waterPipes.forEach(function(pipe, i){
		  if(pipe.state=="empty" || pipe.state=="static"){
			  pipe.state="semi-full";
			}
		else if( pipe.state=="semi-full"){
			pipe.state="full";
		}
		else if(pipe.state=="full" || pipe.state=="done"){
			if(pipe.time<1){
				var flow = pipe.getFlow();
				console.log(pipe.index);
				console.log(pipe.time);
				if(flow.down==true && pipe.index > 14 ){
					if(pipe.state!="done")check=false;
					if(waterPipes[i+15] !=null){
						if(waterPipes[i+15].state=="done")check=true;
					}
					pipes.forEach(function(pipe2, i){
						if(parseInt(pipe2.index)==parseInt(pipe.index)+15){
							
							var flow2 = pipe2.getFlow();
							if(flow2.up==true){
								waterPipes.push(pipe2);
								pipes.splice(i,1);
								check=true;
								return;
							}
						}
					});
				}
				console.log("first");
				console.log(GameOver);
				if(check==false){gameOver();}
				console.log(GameOver);
				if(flow.up==true && pipe.index < 180 ){
					
					if(pipe.state!="done")check=false;
					if(waterPipes[i-15] !=null){
						if(waterPipes[i-15].state=="done")check=true;
					}
					pipes.forEach(function(pipe2, i){
						if(parseInt(pipe2.index)==parseInt(pipe.index)-15){
							
							var flow2= pipe2.getFlow();
							if(flow2.down==true){
								waterPipes.push(pipe2);
								pipes.splice(i,1);
								check=true;
								return;
							}
						}
					});
					
				}
				console.log("second");
				console.log(GameOver);
				if(check==false){gameOver();}
				console.log(GameOver);
				if(flow.right==true && (pipe.index+1) %15 != 0){
					if(pipe.state!="done")check=false;
					console.log("k"+pipe.index);
					console.log("k2 "+(pipe.index+1));
					var temp = entities.getEntity((pipe.index+1));
					if(temp.length !=0){
						console.log(temp[0].state);
						if(temp[0].state=="done")check=true;
					}
					pipes.forEach(function(pipe2, i){
						if(parseInt(pipe2.index)==parseInt(pipe.index)+1){
							
							var flow2= pipe2.getFlow();
							if(flow2.left==true){
								waterPipes.push(pipe2);
								pipes.splice(i,1);
								check=true;
								return;
							}
						}
					});
				}
				console.log("third");
				console.log(GameOver);
				if(check==false){gameOver();}
				console.log(GameOver);
				if(flow.left==true && (pipe.index) %15 != 0){
					
					if(pipe.state!="done")check=false;
					if(waterPipes[i-1] !=null){
						if(waterPipes[i-1].state=="done")check=true;
					}
					pipes.forEach(function(pipe2, i){
						
						if(parseInt(pipe2.index)==parseInt(pipe.index)-1){
							var flow2= pipe2.getFlow();
							if(flow2.right==true){
								waterPipes.push(pipe2);
								pipes.splice(i,1);
								check=true;
								return;
							}
						}
					});
					
				}
				
				console.log("fourth");
				console.log(GameOver);
				if(check==false){gameOver();}
				console.log(GameOver);
				pipe.state="done";
				pipe.time++;
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
function gameOver(){
	//GameOver=true;
	//pipes=[];
	//pipes.push(endPipe);
	//waterPipes=[];
	//waterPipes.push(startPipe);
	//level=1;
	//score = 0;
	//increment = -900;
	//incrementHit = 100;
}

function victory(){
	score+=waterPipes.length+1;
	level+=1;
	pipes=[];
	pipes.push(endPipe);
	waterPipes=[];
	waterPipes.push(startPipe);
	increment = -900;
	incrementHit-=10
	entities = new EntityManager(canvas.width, canvas.height, 64);
	startPipe = new Pipe({x:128,y:64},"end-pipe",17);
	endPipe = new Pipe({x:704,y:576},"end-pipe",146);
	startPipe.state="static";
	startPipe.time=-1;
	endPipe.state="end";
	pipes.push(endPipe);
	waterPipes.push(startPipe);
	pipes.push(startPipe);
	entities.addEntity(startPipe);
	entities.addEntity(endPipe);
	randomPipes.push(randomPipe);
	entities.addEntity(randomPipe);
	pipes.push(randomPipe);
	winAudio.play();
}
/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
	if(GameOver==true){
		ctx.fillStyle = "purple";
		ctx.font = "100px Arial";
		ctx.fillText("GAME OVER",80,200);
		return
	}
	
	  ctx.fillStyle = "#777777";
	  ctx.fillRect(0, 0, canvas.width, canvas.height);
	  entities.renderCells(ctx);
		ctx.fillStyle = "white";
		ctx.font = "30px Arial";
		ctx.fillText("Next Pipe:",750,40);
		ctx.font = "20px Arial";
		ctx.fillText("Level: " + level,20,40);
		ctx.fillText("Score: " + level,150,40);
		ctx.font = "35px Arial";
		if(increment<0){
			ctx.fillText("Water Flows in: " + (Math.floor((increment*-1)/100)+1),300,40);
		}
		else{
			ctx.fillText("Water is flowing!",300,40);
		}
  // TODO: Render the board
	
	waterPipes.forEach(function(pipe, i){
		pipe.render(elapsedTime,ctx);
	});
	pipes.forEach(function(pipe, i){
		pipe.render(elapsedTime,ctx);
	});
	randomPipes[randomPipes.length-1].render(elapsedTime,ctx);
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
	if(this.cells[index] == null){
		return -1;
	}
	else if(this.cells[index].length == 0){
		return -1;
	}
	return 1;
}

EntityManager.prototype.getEntity = function(index){
	return this.cells[index];
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



/**
 * @constructor Pipe
 * Creates a new Pipe object
 * @param {Postition} position object specifying an x and y
 */
function Pipe(position,type,index) {
	this.time=0;
  this.state = "empty";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.type = type;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/' + this.type + '.png');
  this.translateX = 0;
  this.translateY = 0;
  this.rotate = "0";
  this.index = index;
  this.frame = 0;
  this.up=false;
  this.down=false;
  this.left=false;
  this.right=false;
  if(this.type=="2-pipe-90"){
		this.down=true;
		this.up=false;
		this.right=true;
		this.left=false;
		
  }
  else if(this.type=="2-pipe"){
		this.left=true;
		this.right=true;
		this.down=false;
		this.up=false;
		
  }
  else if(this.type=="4-pipe"){
		this.left=true;
		this.right=true;
		this.up=true;
		this.down=true;
		
  }
  else if(this.type=="3-pipe"){
		this.left=true;
		this.right=true;
		this.down=true;
		this.up=false;
		
  }
  else if(this.type=="end-pipe"){
		this.left=false;
		this.right=false;
		this.down=true;
		this.up=false;	
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

Pipe.prototype.getFlow = function(){
	return {right:this.right,left:this.left,up:this.up,down:this.down};
}

Pipe.prototype.rotateFlow=function(){
		this.left2=false;
		this.right2=false;
		this.up2=false;
		this.down2=false;
		if(this.type!="2-pipe"){
			if(this.right==true){
				this.down2=true;
			}
			if(this.down==true){
				this.left2=true;
			}
			if(this.left==true){
				this.up2=true;
			}
			if(this.up==true){
				this.right2=true;
			}
		}
		else if(this.type=="2-pipe"){
			if(this.right==true){
				this.up2=true;
				this.down2=true;
			}
			if(this.down==true){
				this.left2=true;
				this.right2=true;
			}
			
		}
		this.down=this.down2;
		this.left=this.left2;
		this.up=this.up2;
		this.right=this.right2;
		
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
