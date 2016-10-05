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
function Pipe(position,type) {
  this.state = "empty";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.type = type;

}

/**
 * @function updates the Pipe object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pipe.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  switch(this.state) {
    case "walking":
      if(this.timer > 1000/16) {
        this.frame = (this.frame + 1) % 4;
        this.timer = 0;
      }
      this.y -= 1;
      break;
  }
  this.color = '#000000';
  console.log(this._cell);
}

/**
 * @function renders the Pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Pipe.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    0, 0, this.width, this.height,
    // destination rectangle
    this.x, this.y, this.width, this.height
  );
  ctx.strokeStyle = this.color;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
}
