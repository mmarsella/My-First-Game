/** 

STORY:  Village on bottom of screen
- Needs to protect village with the only ship in the poor village
- If any enemies cross the line, game over.

1) User controls a ship on bottom of screen. 
2) Shoots at enemies cascading down (maybe from right?)
3) Lose if you are touched by anything 
4) Win if all enemies are destroyed

*/

  //FREEZES WINDOW SCROLLING

$('body').css({'overflow':'hidden'});
$(document).bind('scroll',function () { 
    window.scrollTo(0,0); 
  });

var canvas = document.getElementById("myCanvas");

// stores all 2d rendering
var ctx = canvas.getContext("2d");

var ballRadius = 5;
var color = "red";


/** CONTROLS */

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false; // Firing button
var fireCount = 0;
var spaceCount = 0;

var shoot = false;

var startX;
var startY;


//Bullet Coordinates

var bulletRadius = 5;






/**
We use on-load when we are manipulating images that we are
importing into the game */

/**
We DO NOT use on-load when shapes are drawn using the canvas tool */

// Ship image
var shipReady = true;
var shipImage = new Image();
shipImage.onload = function () {
  shipReady = true;
};
shipImage.src = "images/speedship.png";

var shipX = canvas.width / 2;
var shipY = canvas.height / 2;
console.log("Ship X: " + shipX);
console.log("Ship Y: " + shipY);

var shipWidth = 60;
var shipHeight = 75;

//canvas.style.background = "url('images/DenseStarFieldBackground.png')";

//buller coordinates
var x = shipX + 30;
var y = shipY;
console.log("X: " + x);
console.log("y: " + y);
 // add a small value to x and y after every frame has been drawn to make it appear that the ball is moving.
var dx = 2;
var dy = -2;




var render = function (){

  /** MAKING IT MOVE */
    // Clears the screen
    // 4 params: x/y of bottom right corners of a rect. --> whole area will be cleared of any content painted
    
    // this is making the ball disappear 
    ctx.clearRect(0,0, canvas.width, canvas.height);

      

  if(shipReady) {
    // if there is a ball redraw the ball
    ctx.drawImage(shipImage,shipX,shipY,shipWidth,shipHeight);
  }

  if(shoot) {
      drawBall(); 
    }
  // if(shoot)
  // {
  //   drawShot();
  // }

};

/** UPDATE THE SPACESHIP MOVEMENTS */


//Listens for keys
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// when the keys are pressed, set to true
function keyDownHandler(e)
{
  if(e.keyCode == 39)  // keyCode 39 is the right cursor
  {
    console.log("right");
    rightPressed = true;
  }
  else if(e.keyCode == 37)  // keycode 37 is left
  {
    console.log("left");
    leftPressed = true;
  }
  else if(e.keyCode == 38)
  {
    console.log("up");
    upPressed = true;
  }
  else if(e.keyCode == 40)
  {
    console.log("down");
    downPressed = true;
  }
  else if(e.keyCode == 32)
  {
    console.log("SPACE");
    spaceCount++;
    spacePressed = true;
    fireCount++;
  }
}

///when key is released, set to false
function keyUpHandler(e)  // e --> event
{
  if(e.keyCode == 39)
  {
    console.log("right off!");
    rightPressed = false;
  }
  else if(e.keyCode == 37)
  {
    leftPressed = false;
  }
  else if(e.keyCode == 38)
  {
    upPressed = false;
  }
  else if(e.keyCode == 40)
  {
    downPressed = false;
  }
  else if(e.keyCode == 32)
  {
    console.log("SPACE UP!");
    spacePressed = !spacePressed;
    console.log("Space is :" + spacePressed);
  }
}




var update = function(mod)
{
  if(rightPressed)
  {
    shipX += 7;
    x = shipX + 30;

  }
  else if(leftPressed)
  {
    shipX -= 7;
    x = shipX + 30;
  }
  else if(upPressed)
  {
    shipY -= 7;
    y = shipY;
  }
  else if(downPressed)
  {
    shipY += 7;
    y = shipY;

  }
  else if(spacePressed)
  {
    shoot = true;

  }
};


/** THE MAIN GAME LOOP */

var main = function ()
{
  var now = Date.now();
  var delta = now - then;


  update(delta / 500);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

var then = Date.now();
main();



function drawBall()
{
  
   // drawing code
  ctx.beginPath();
  //why the Math.PI * 2???
  // console.log("spaceCount", spaceCount) 
  // on first shot do this
  if(fireCount === 1){
    startX = x;
    startY = y;
    console.log("Firecount", fireCount);
    console.log("startX", startX);
    console.log("startY", startY);
    ctx.arc(x,y,ballRadius,0, Math.PI*2);  
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    y += dy;
    fireCount++;

  }

  else if(fireCount > 1 && spaceCount > 0) {

    console.log("Firecount after!", fireCount);
    // on any render after do this....
    ctx.arc(startX,startY,ballRadius,0, Math.PI*2);  
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    startY += dy;
  }
  

  
}

// function drawShot()
// {
//     // drawing code
//   ctx.beginPath();
//   //why the Math.PI * 2???
//   ctx.arc(x,y,bulletRadius,0, Math.PI*2);
//   ctx.fillStyle = "red";
//   ctx.fill();
//   ctx.closePath();
//   x += dx;
//   y += dy;
// }