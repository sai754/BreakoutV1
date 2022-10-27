const can = document.getElementById("breakout");
const canv = can.getContext("2d");

canv.lineWidth = 2;
//variables
const paddle_w = 150;
const paddle_marginb = 50;
const paddle_h = 20;
let leftArrow = false;
let rightArrow = false;
const BALL_RADIUS = 8;
let life = 5;
let score = 0;
let LEVEL = 1;
const MAX_LEVEL = 3;
const score_unit = 10;
let game_over = false;
//creating paddle
const paddle = {
  x: can.width / 2 - paddle_w / 2,
  y: can.height - paddle_marginb - paddle_h,
  width: paddle_w,
  height: paddle_h,
  dx: 10,
};

//drawing paddingLeft
function drawPaddle() {
  canv.fillStyle = "#5DA7DB";
  canv.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  canv.strokeStyle = "#3C4048";
  canv.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
//control paddle
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    leftArrow = true;
  } else if (event.keyCode == 39) {
    rightArrow = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
});
//move paddle
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < can.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}
//create the ball
const ball = {
  x: can.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 5,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};
//draw ball
function drawBall() {
  canv.beginPath();

  canv.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  canv.fillStyle = "#5DA7DB";
  canv.fill();
  canv.strokeStyle = "#3C4048";
  canv.stroke();
  canv.closePath();
}
//move the ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}
//collision detection with wall
function ballWall() {
  if (ball.x + ball.radius > can.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    wallhit.play();
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    wallhit.play();
  }
  if (ball.y + ball.radius > can.height) {
    life--;
    lifel.play();
    resetBall();
  }
}
//ball and paddle collision
function ballPaddle() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    whit.play();
    //for checking where the ball hit
    let cpoint = ball.x - (paddle.x + paddle.width / 2);
    cpoint = cpoint / (paddle.width / 2);
    //calculate angle
    let angle = (cpoint * Math.PI) / 3;
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}
//reset ball
function resetBall() {
  ball.x = can.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}
//create bricks
const brick = {
  row: 1,
  column: 20,
  width: 55,
  height: 25,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#1D1CE5",
  strokeColor: "#3C4048",
};
let bricks = [];
function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}
createBricks();
//draw bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        canv.fillStyle = brick.fillColor;
        canv.fillRect(b.x, b.y, brick.width, brick.height);
        canv.strokeStyle = brick.strokeColor;
        canv.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}
//ball and brick collision
function ballbrick() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > ball.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          bhit.play();
          ball.dy = -ball.dy;
          b.status = false;
          score += score_unit;
        }
      }
    }
  }
}

//game statistics
function gameStats(text, textx, texty, img, imgx, imgy) {
  canv.fillStyle = "#FFF";
  canv.font = "25px Montserrat sans-serif";
  canv.fillText(text, textx, texty);

  canv.drawImage(img, imgx, imgy, (width = 25), (height = 26));
}
//game over
function gameOver() {
  if (life <= 0) {
    showlose();
    game_over = true;
  }
}
//level up
function levelUp() {
  let isLevelDone = true;
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }
  if (isLevelDone) {
    lvlup.play();
    if (LEVEL >= MAX_LEVEL) {
      showwin();
      game_over = true;
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 1;
    resetBall();
    LEVEL++;
  }
}
//draw function
function draw() {
  drawPaddle();
  drawBall();
  drawBricks();
  //score
  gameStats(score, can.width - 25, 25, sc_img, can.width - 55, 5);
  //lives
  gameStats(life, 35, 25, life_img, 5, 5);
  //level
  gameStats(LEVEL, can.width / 2, 25, lev_img, can.width / 2 - 30, 5);
}
//update function
function update() {
  movePaddle();
  moveBall();
  ballWall();
  ballPaddle();
  ballbrick();
  gameOver();
  levelUp();
}

function loop() {
  //clearing canvas
  canv.drawImage(bg_img, 0, 0);
  draw();
  update();
  if (!game_over) {
    requestAnimationFrame(loop);
  }
}
loop();

const sounde = document.getElementById("sound");

sounde.addEventListener("click", audioM);
function audioM() {
  let imgsrc = sounde.getAttribute("src");
  let sound_i =
    imgsrc == "img/soundon1.png" ? "img/soundoff1.png" : "img/soundon1.png";
  sounde.setAttribute("src", sound_i);

  //mute and unmute
  whit.muted = whit.muted ? false : true;
  lifel.muted = lifel.muted ? false : true;
  lvlup.muted = lvlup.muted ? false : true;
  wallhit.muted = wallhit.muted ? false : true;
  bhit.muted = bhit.muted ? false : true;
}

//game over
const gameover = document.getElementById("gameover");
const gamelost = document.getElementById("gamelost");
const gamewon = document.getElementById("gamewon");
const restart = document.getElementById("restart");

restart.addEventListener("click", function () {
  location.reload();
});

function showwin() {
  gameover.style.display = "block";
  gamewon.style.display = "block";
}
function showlose() {
  gameover.style.display = "block";
  gamelose.style.display = "block";
}
