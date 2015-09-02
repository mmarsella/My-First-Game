/** 

- Village on bottom of screen
- Needs to protect village with the only ship 
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

var canvasHeight = canvas.height;
var canvasWidth = canvas.width;
console.log("Canvas Height: " + canvasHeight);
console.log("Canvas Width: " + canvasWidth);


/** ENEMIES */

/** BRICK VARIABLES */

var enemyRowCount = 3;
var enemyColumnCount = 3;
var enemyWidth = 20;
var enemyHeight = 20;
var enemyPadding = 10;
var enemyOffsetTop = 90;
var enemyOffsetLeft = 155;

/** Holds all the bricks in a 2-d array
  each brick will create an object with x/y coords */

// Loops thru the rows and columns and create new bricks
var enemies = [];

for(c = 0; c < enemyColumnCount;c++){
  enemies[c] = [];

  for(r = 0; r < enemyRowCount; r++){
    enemies[c][r] = {x: 0, y:0, status: 1}; // status --> aids in bricks dissapearing
  } // if status = 0, don't repaint this brick
}


/** SCORE/MENU */

var score = 0;

var enemyKills = 0;

//Checks win/lose status of game
var end = false;

/**
We use on-load when we are manipulating images that we are
importing into the game */

/**
We DO NOT use on-load when shapes are drawn using the canvas tool */

// Ship image  --> http://millionthvector.blogspot.com/p/free-sprites.html
var shipReady = true;
var shipImage = new Image();
shipImage.onload = function () {
  shipReady = true;
};
shipImage.src = "images/speedship.png";

var shipX = (canvas.width / 2) - 30;
var shipY = canvas.height  - 100;
// console.log("Ship X: " + shipX);
// console.log("Ship Y: " + shipY);

var shipWidth = 60;
var shipHeight = 75;

canvas.style.background = "url('images/background.png')";

//buller coordinates
var x = shipX + 30;
var y = shipY;
//console.log("X: " + x);
// console.log("y: " + y);
 // add a small value to x and y after every frame has been drawn to make it appear that the ball is moving.
var dx = 5;  // may not need this
var dy = -28;


function drawEnemies(dx,dy,currentX,currentY)
{
  //dx = -0.10;
  dy = 0.10;
  for(c = 0; c < enemyColumnCount; c++)
  {
    for(r=0; r < enemyRowCount; r++)
    {
      if(enemies[c][r].status == 1) //checks to see if enemy hasn't been hit (1), rewrite
      {
        // Calculation to set x/y coords for each enemy (so they won't stack on eachother)
        var enemyX = (r*(enemyWidth+enemyPadding)) + enemyOffsetLeft;
        var enemyY = (c*(enemyHeight+enemyPadding)) + enemyOffsetTop;

        // console.log("Drawing enemies..");
        // console.log("Top: " + enemyOffsetTop);
        // console.log("Left: " + enemyOffsetLeft);
        /** ENEMY MOTION */
         enemyOffsetTop += dy;
        // enemyOffsetLeft += dx;
          enemies[c][r].x = enemyX;
          enemies[c][r].y = enemyY;
          ctx.beginPath();
          ctx.rect(enemyX,enemyY,enemyWidth,enemyHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath(); 
      }
    }
  }
}

function resetEnemies()
{
   for(c = 0; c < enemyColumnCount; c++)
  {
    for(r = 0; r < enemyRowCount; r++)
    {
      var enem = enemies[c][r];
      console.log(enem);

      // Set status to 0
      enem.status = 1;

      // Reset enemy starting coordinates
      enemyOffsetTop = 90;
      enemyOffsetLeft = 155;

      var enemyX = (r*(enemyWidth+enemyPadding)) + enemyOffsetLeft;
      var enemyY = (c*(enemyHeight+enemyPadding)) + enemyOffsetTop;
      enemies[c][r].x = enemyX;
      enemies[c][r].y = enemyY;
    }
  }
}

function collisionDetection()
{
  /** BULLET */
  if(startY < 0)
  {
  console.log("DETECTING...");
    shoot = false;
    fireCount = 0;
    spaceCount = 0;
    x = shipX + 30;
    y = shipY;
  }


  // Why won't my code work w/o this????
  /** SHIP (w/WALLS) */
  if(shipX < 0)
  {
    leftPressed = false;
  }
  else if(shipY > canvasHeight - shipHeight)
  {
    downPressed = false;  
  }
  else if(shipX > canvasWidth - shipHeight + 16)
  {
    rightPressed = false;
  }

}

function enemyCollision()
{
  for(c = 0; c < enemyColumnCount; c++)
  {
    for(r = 0; r < enemyRowCount; r++)
    {
      var enem = enemies[c][r];

      if(enem.status == 1)
      {
        if(startX + ballRadius > enem.x && startX - ballRadius < enem.x + enemyWidth && startY + ballRadius > enem.y && startY - ballRadius < enem.y + enemyHeight)
        {
          console.log("HIT!");
          enem.status = 0;  // Mark as a hit
          shoot = false;
          fireCount = 0;
          spaceCount = 0;
          x = shipX + 30;
          y = shipY;
          score++;
          enemyKills++;


          // FIXED tthe collision of an already fired/collided ball registering for oncoming enemies to trigger a hit
          startX = x;
          startY = y;
        }
        // Enemy touches bottom of canvas
        else if(enem.y > canvasHeight - enemyHeight)
        {
          end = true;
          lose();
        }
        //Enemy touches ship
        // else if(enem.y > shipY && enem.x > shipX && )
        // {
        //   end = true;
        //   dead();

        // }
      }
    }
  }
}




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
      //console.log("Drawing ball....");
      drawBall(); 
    }

  enemyCollision();

  if(enemyKills <= 6)
  {
    drawEnemies(); 
  }

  if(enemyKills === 6)
  {
    //console.log("INSIDE the RESET");
    enemyKills = 0;
    resetEnemies(); 
    // drawEnemies();
  }


  drawScore();
  // console.log('Y: ' + y + ballRadius);
  // console.log("DY: " + dy);

  if(score == 12)
  {
    end = true;
    win();
  }

  collisionDetection();


};

/** UPDATE THE SPACESHIP MOVEMENTS */


//Listens for keys
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// when the keys are pressed, set to true
function keyDownHandler(e)
{
  if(e.keyCode == 39 && shipX < canvasWidth - shipWidth)  // keyCode 39 is the right cursor
  {
    //console.log("right");
    rightPressed = true;
  }
  else if(e.keyCode == 37  && shipX > 0)  // keycode 37 is left
  {
    //console.log("left");
    leftPressed = true;
  }
  else if(e.keyCode == 38 && shipY > 0)
  {
    //console.log("up");
    upPressed = true;
  }
  else if(e.keyCode == 40 && shipY < canvasHeight - shipHeight)
  {
    console.log("Ship Y: " + shipY);
    //console.log("shipY: " + shipY);
    downPressed = true;
  }
  else if(e.keyCode == 32)
  {
    //console.log("SPACE");
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
    spacePressed = !spacePressed;
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


  if(!end)
  {
    update(delta / 10000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
  }
};

var then = Date.now();
main();


// draws ball starting from the center of the ship
// and travels up y-axis 
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
    //console.log("Firecount", fireCount);
    //console.log("startX", startX);
    //console.log("startY", startY);
    ctx.arc(x,y,ballRadius,0, Math.PI*2);  
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    y += dy;
    fireCount++;

  }
  else if(fireCount > 1 && spaceCount > 0) {

    //console.log("Firecount after!", fireCount);
    // on any render after do this....
    ctx.arc(startX,startY,ballRadius,0, Math.PI*2);  
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    startY += dy;
  } 
}

function drawScore()
{
  ctx.font = "16px Arial"; // sets size and font type
  ctx.fillStyle = "#0095DD"; // color of text
  ctx.fillText("Score: " + score, 8, 20);  //.fillText(text, coordX,coordY)
}

function win()
{
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("YOU WIN!!!", 160, 100);
}

function lose()
{
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("YOU LOSE", 160, 100);
}

function dead()
{
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("You've been HIT!",160,100);
}












