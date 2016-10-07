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
