const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const gridSize = 20;

//variables
let snake = [{ x: 10, y: 10 }]; //let as board stays same so const, snake changes so let
let food = generateFood();
let direction = "right";
let gameSpeedDelay = 200;
let gamestarted = false;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0; // Retrieve high score from local storage
let gameInterval;

//draw map, snake,food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake"); //div has snake class
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  if (gamestarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

//create snake or food div
function createGameElement(tag, NameOfClass) {
  const element = document.createElement(tag);
  element.className = NameOfClass;
  return element;
}

//snake, food pos
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function generateFood() {
  // const x = Math.floor(Math.random() * gridSize) + 1; //0-0.99 math.random; to not get 0 we +1; to get whole no. floor
  let newFood;
  do {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    newFood = { x, y };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  ); // Ensure food is not on the snake
  return newFood;
}

//moving snake
function move() {
  const head = { ...snake[0] }; //spread operator to get shallow copy
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); //clear all
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

//start game
function startGame() {
  gamestarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(event) {
  if (!gamestarted && (event.code === "Space" || event.key === " ")) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.y < 1 || head.x > gridSize || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function stopGame() {
  clearInterval(gameInterval);
  gamestarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = "Score: " + currentScore.toString().padStart(3, "0");
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("highScore", highScore); // Save the new high score to local storage
    highScoreText.textContent =
      "HighScore: " + currentScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

document.addEventListener("keydown", handleKeyPress);

//testing
// setInterval(() => {
//     move();
//     draw();
// },200);
