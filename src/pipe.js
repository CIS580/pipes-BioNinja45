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
