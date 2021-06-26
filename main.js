'use strict';

const score = document.querySelector('.score');
const gameStart = document.querySelector('.game-start');
const gameArea = document.querySelector('.game-area');
const image = document.querySelector('.image');
const newGame = document.querySelector('.new-game');
const car = document.createElement('div');

car.classList.add('car');

gameStart.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
newGame.addEventListener('click', startGame);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
}

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3.5
}

const HEIGHT_ELEM = 100;
const MAX_ENEMIES = 7;

const carCrash = new Audio('car-crash.mp3');

function startGame() {
  gameArea.innerHTML = ``;
  gameStart.classList.add('hidden');
  newGame.classList.add('hidden');
  image.classList.add('hidden');
  gameArea.classList.remove('hidden');
  score.classList.remove('hidden');


  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = i * HEIGHT_ELEM + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.backgroundImage = `url(images/enemy-${getRandomEnemy()}.png)`;
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.speed = 5;
  setting.start = true;
  gameArea.append(car);
  car.style.left = '125px';
  car.style.bottom = '10px';
  car.style.top = 'auto';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}


function playGame() {
  if (setting.start) {
    moveRoad();
    moveEnemy();

    setting.score ++;
    score.innerHTML = 'SCORE<br>' + setting.score;
    
    if (setting.score % 1000 == 0) {
      setting.speed += 3;
    }

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');

  lines.forEach(item => {
    item.y += setting.speed;
    item.style.top = item.y + 'px';

    if (item.y > gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM;
    }
  })
}

function getQuantityElements(heightElement) {
  return (gameArea.offsetHeight / heightElement) + 1;
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top + 3 < enemyRect.bottom - 3 &&
        carRect.right - 3 > enemyRect.left + 3 && 
        carRect.left + 3 < enemyRect.right - 3 && 
        carRect.bottom - 3 > enemyRect.top + 3) {
          carCrash.play();
          setting.start = false;
          newGame.classList.remove('hidden');
          newGame.style.top = score.offsetHeight + 'px';
          
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y > gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  })
}

function getRandomEnemy() {
  return Math.floor((Math.random() * MAX_ENEMIES) + 1);
}