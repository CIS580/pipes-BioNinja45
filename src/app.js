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
var increment = -900;
var startPipe = new Pipe({x:64,y:64},"end-pipe",16);
var endPipe = new Pipe({x:768,y:704},"end-pipe",177);
endPipe.rotateFlow();
endPipe.rotateFlow();
startPipe.state="static";
endPipe.state="empty";
endPipe.rotate="180";
waterPipes.push(endPipe);
waterPipes.push(startPipe);

entities.addEntity(startPipe);
entities.addEntity(endPipe);
var pipeType = ["4-pipe","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","3-pipe","2-pipe","2-pipe-90","2-pipe","2-pipe-90"];
var placeAudio = new Audio("assets/place.wav");
var rotateAudio = new Audio("assets/rotate.wav");
//var myAudio = new Audio("assets/background.m4a");
//myAudio.loop = true;
//myAudio.play();
var GameOver=false;
var randomPipeType = pipeType[Math.floor(Math.random()*pipeType.length)];
var randomPipe = new Pipe({x:896, y:0}, randomPipeType,14);
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
				//pipes.push(randomPipe);
				entities.addEntity(new Pipe({x:parseInt(x), y:parseInt(y)},randomPipe ));
				randomPipeType="";
				randomPipe=null;
				var randomPipeType2 = pipeType[Math.floor(Math.random()*pipeType.length)];
				console.log(randomPipeType2.toString());
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
					if(pipe.state != "static"){
						
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
  if(increment==100){
	  waterPipes.forEach(function(pipe, i){
		  if(pipe.state=="empty" || pipe.state=="static"){
			  pipe.state="semi-full";
			}
		else if( pipe.state=="semi-full"){
			pipe.state="full";
		}
		else if(pipe.state=="full"){
			var flow = pipe.getFlow();
			if(flow.down==true && pipe.index > 14 ){
				if(entities.checkEntity(pipe+15) != 1) gameOver();
				pipes.forEach(function(pipe2, i){
					
					if(parseInt(pipe2.index)==parseInt(pipe.index)+15){
						var flow2 = pipe2.getFlow();
						if(flow2.up==true){
							waterPipes.push(pipe2);
							pipes.splice(i,1);
							return;
						}
					}
				});
			}
			if(flow.up==true && pipe.index < 180 ){
				if(entities.checkEntity(pipe-15) != 1) gameOver();
				pipes.forEach(function(pipe2, i){
					if(parseInt(pipe2.index)==parseInt(pipe.index)-15){
						var flow2= pipe2.getFlow();
						if(flow2.down==true){
							waterPipes.push(pipe2);
							pipes.splice(i,1);
						}
					}
				});
				
			}
			if(flow.right==true && (pipe.index+1) %15 != 0){
				if(entities.checkEntity(pipe+1) != 1) gameOver();
				pipes.forEach(function(pipe2, i){
					if(parseInt(pipe2.index)==parseInt(pipe.index)+1){
						var flow2= pipe2.getFlow();
						if(flow2.left==true){
							waterPipes.push(pipe2);
							pipes.splice(i,1);
						}
					}
				});
			}
			
			if(flow.left==true && (pipe.index) %15 != 0){
				if(entities.checkEntity(pipe-1) != 1) gameOver();
				pipes.forEach(function(pipe2, i){
					if(parseInt(pipe2.index)==parseInt(pipe.index)-1){
						var flow2= pipe2.getFlow();
						if(flow2.right==true){
							waterPipes.push(pipe2);
							pipes.splice(i,1);
						}
					}
				});
				gameOver();
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
	return;
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

  // TODO: Render the board
	entities.renderCells(ctx);
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
