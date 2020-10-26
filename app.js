const grid = document.querySelector('.grid');
const doodler = document.createElement('div');
const scoreCard = document.getElementById('score');
const gameEndMessage = document.getElementById('gameEndMessage');
let doodlerLeftSpace = 50;
let doodlerBottomSpace = 300;
let platformCount = 5;
let platformArray = [];
let isGameOver = false;
let upTimer, downTimer, leftTimer, rightTimer;
let isJumping = true;
let startPoint = 150;
let isRight = false;
let isLeft = false;
let score = 0;
const gridStyle = window.getComputedStyle(grid);
const gridWidth = parseInt(gridStyle.width, 10); //getting grid width from style.css and parsing only the number part (e.g. "400" instead of "400px") 
var gridHeight = parseInt(gridStyle.height, 10);

class Platform {
    constructor(platformBottom) {
        this.bottom = platformBottom;
        this.left = Math.random() * (gridWidth - 80); //placing it somewhere between the grid width - platform width
        this.platform = document.createElement('div');

        const platform = this.platform;
        platform.classList.add('platform');
        platform.style.bottom = this.bottom + 'px';
        platform.style.left = this.left + 'px';
        grid.appendChild(platform);
    }
}

function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platformArray[0].left + 10; //make doodler start on the first platform
    doodlerBottomSpace = platformArray[0].bottom + 10;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
}

function createPlatform () {
    for(let i = 0; i < platformCount; i++) {  
        let platformGap = gridHeight / platformCount; //height of grid divided by number of platforms
        let platformBottom = 100 + i * platformGap; //varying vertical gap between platforms
        let newPlatform = new Platform(platformBottom);
        platformArray.push(newPlatform);
    }
}

function movePlatforms() {
    if(doodlerBottomSpace > 50) {
    platformArray.forEach(platformElement => {
        platformElement.bottom -= 4;
        let platform = platformElement.platform;
        platform.style.bottom = platformElement.bottom + 'px';
        
        if(platformElement.bottom < 1) { //making platforms disappear as they reach the bottom of the screen
            let firstPlatform = platformArray[0].platform;
            firstPlatform.classList.remove('platform');
            platformArray.shift();
            let newPlatform = new Platform(gridHeight); //add new platforms coming in from the top
            platformArray.push(newPlatform);
            score+=10;
            scoreCard.innerHTML= "Score:" + score;
        }
    })    
    }
}

function gameOver() {
    console.log('game over');
    isGameOver = true;
    clearInterval(upTimer);
    clearInterval(downTimer);
    clearInterval(leftTimer);
    clearInterval(rightTimer);
    while(grid.firstChild) {
        grid.firstChild.remove();
    }
    gameEndMessage.innerHTML = "Game Over <br/> Score: " + score;
}


function fall() {
    isJumping = false;
    clearInterval(upTimer);
    downTimer = setInterval(function () {
        doodlerBottomSpace -= 5;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if(doodlerBottomSpace == 0) {
        gameOver();
        }
        platformArray.forEach(platform => {
        if((doodlerBottomSpace >= platform.bottom && 
            doodlerBottomSpace <= platform.bottom + 10) && ((doodlerLeftSpace + 60) >= platform.left && 
            doodlerLeftSpace <= (platform.left + 80)) && !isJumping) {
                startPoint = doodlerBottomSpace;
                jump();
            }
        })
    }, 30);   
}

function control(e) {
    if(e.key == "ArrowLeft") {
        moveLeft();
    }
    if(e.key == "ArrowRight") {
        moveRight();
    }
    if(e.key == "ArrowUp") {
        moveStraight();
    }
}

function jump() {
    isJumping = true;
    clearInterval(downTimer);
    upTimer = setInterval(function () {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if(doodlerBottomSpace > startPoint + 300) {
            fall();
        }
    }, 20);
}

function moveLeft() {
    clearInterval(rightTimer);
    isRight = false;
    isLeft = true;
    leftTimer = setInterval(function () {
        if (doodlerLeftSpace >= 0) {
            doodlerLeftSpace -= 5;
            doodler.style.left = doodlerLeftSpace + 'px';
        }
        else {
            moveRight();
        }
    }, 20)
}
   

function moveRight() {
    clearInterval(leftTimer);
    isLeft = false;
    isRight = true;
    rightTimer = setInterval(function() {
    if(doodlerLeftSpace <= gridWidth - 60) { //grid width minus doodler width, to keep the doodler within the grid
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
    }
    else {
        moveLeft();
    }
}, 20)
}

function moveStraight() {    
    if(doodlerBottomSpace > 20) {
        doodlerBottomSpace += 10;
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }
    clearInterval(rightTimer);
    clearInterval(leftTimer);
    isLeft = false;
    isRight = false;
}

function start() {
    if(!isGameOver) {
        createPlatform();
        createDoodler();  
        setInterval(movePlatforms, 20);
        jump();
        document.addEventListener("keyup", control);
              
    }
}



start();
