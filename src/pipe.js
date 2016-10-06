"use strict";

/**
 * @module exports the Pipe class
 */
module.exports = exports = Pipe;

var flow  = {
	up:false,
	down:true,
	left:false,
	right:false
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
	case "4-pipe":
		flow.left=true;
		flow.right=true;
		flow.up=true;
		flow.down=true;
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
