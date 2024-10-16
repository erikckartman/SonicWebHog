//Canvas of scene
const gamecanvas = document.getElementById("game");
const ctx = gamecanvas.getContext("2d");
gamecanvas.style.display = 'block';
gamecanvas.style.backgroundImage = "url('sprites/title.png')";
gamecanvas.style.backgroundSize = 'cover';
gamecanvas.style.backgroundPosition = 'center';

//Variables
var isRun = true;
var curretSprite = 1;
let intervalAnim;
let groundInterval;
const groundSpeed = 15;
let groundXPos1 = 0;
let groundXPos2 = 800;
let coordinats;
let intervalM;
let intCol;
let gameStarted = false;

//Motobug's variables
var sizeM = 45;
var posXM = 800;
var posYM = 305;
let enemyAp;
var nextAp = 3000;
var chooseRobot = 1;

//Motobug's collision
var motobugX1 = posXM;
var motobugX2 = posXM + sizeM;
var motobugY1 = posYM;
var motobugY2 = posYM + sizeM;

//Fly badnik variables
var fbsX = 60;
var fbsY = 30;
var fbPosX = 800;
var fbPosY = 250;
let flyAnimIntr;

//Fly badnik collision
var flyBX1 = fbPosX;
var flyBX2 = fbPosX + fbsX;
var flyBY1 = fbPosY;
var flyBY2 = fbPosY + fbsY;

//Sonic's variables
var ssX = 45;
var ssY = 80;
var posX = 100;
var posY = 270;

//Sonic's collision
var sonicX1 = posX;
var sonicX2 = ssX + posX;
var sonicY1 = posY;
var sonicY2 = posY + ssY;

//Import sprites
var ground = new Image(); //Ground
ground.src = "sprites/ground.png";
var player = new Image(); //Player
var motobug = new Image();
var badnikfly = new Image();

//Score
const scoreDiv = document.createElement('div');
scoreDiv.style.position = 'fixed';
scoreDiv.style.top = '10px';
scoreDiv.style.right = '10px';
scoreDiv.style.fontSize = '24px';
scoreDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
scoreDiv.style.color = 'white'; 
scoreDiv.style.padding = '10px';
document.body.appendChild(scoreDiv);
let score = 0;
let scoreInterval;

//Highscore
const hscoreDiv = document.createElement('div');
hscoreDiv.style.position = 'fixed';
hscoreDiv.style.top = '70px';
hscoreDiv.style.right = '10px';
hscoreDiv.style.fontSize = '24px';
hscoreDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
hscoreDiv.style.color = 'white'; 
hscoreDiv.style.padding = '10px';
document.body.appendChild(hscoreDiv);
let hscore = localStorage.getItem('hscore') ? parseInt(localStorage.getItem('hscore')) : 0;
hscoreDiv.textContent = 'Highscore: ' + hscore;

//Clear score
const buttonCS = document.createElement('button');
buttonCS.textContent = 'CLEAR SCORE';
buttonCS.style.position = 'fixed';
buttonCS.style.top = '130px';
buttonCS.style.right = '10px';
buttonCS.style.fontSize = '28px';
buttonCS.style.padding = '10px 20px';
document.body.appendChild(buttonCS); 

const spriteRun = [
    'sprites/sonic_run1.png',
    'sprites/sonic_run2.png',
    'sprites/sonic_run3.png',
    'sprites/sonic_run4.png'
];

const spriteJump = [
	'sprites/sonic_jump1.png',
    'sprites/sonic_jump2.png',
    'sprites/sonic_jump3.png',
    'sprites/sonic_jump4.png'
];

const groundBadnik = [
	'sprites/motobug.png',
	'sprites/metalsonic.png'
];

const flyBadnik = [
	'sprites/chamelion.png'
];

player.src = spriteRun[curretSprite];
motobug.src = groundBadnik[chooseRobot];
badnikfly.src = flyBadnik[0];

//Draw sprites
function drawGround(){	
	ctx.clearRect(groundXPos1, 350, 800, 50);
	ctx.clearRect(groundXPos2, 350, 800, 50);

	ctx.drawImage(ground, groundXPos1, 350, 800, 50);
	ctx.drawImage(ground, groundXPos2, 350, 800, 50);
}

function drawSonic(){	
	if(isRun && posY < 270){
		ctx.clearRect(100, posY - 20, ssX, ssY);
		ctx.drawImage(player, 100, posY, ssX, ssX);
	}
	else if(isRun && posY >= 270){
		ctx.clearRect(100, posY - 30, ssX, ssY + 30);
		ctx.drawImage(player, 100, posY, ssX, ssY);
	}
	else{
		ctx.clearRect(100, posY + 20, ssX, ssY);
		ctx.drawImage(player, 100, posY, ssX, ssX);
	}
}

function sonicAnimation(){
	intervalAnim = setInterval(() => {
		if(isRun && posY < 270){
			ssY = 45;
			curretSprite = (curretSprite + 1) % 4;
			player.src = spriteJump[curretSprite];
			posY += 20;
			drawSonic();					
		}
		else if(isRun && posY >= 270){
			ssY = 80;
			curretSprite = (curretSprite + 1) % 4;
			player.src = spriteRun[curretSprite];
			drawSonic();
		}
		else{
			curretSprite = (curretSprite + 1) % 4;
			posY -= 15;
			player.src = spriteJump[curretSprite];
			drawSonic();
			ssY = 45;
		}

		if(posY <= 150){
			isRun = true;
		}
	}, 40);
}

function groundAnimation(){
	groundInterval = setInterval(() => {
		groundXPos1 -= groundSpeed;
		groundXPos2 -= groundSpeed;

		drawGround();

		if (groundXPos1 <= -800) {
			groundXPos1 = 0;
		}
		if (groundXPos2 <= 0) {
			groundXPos2 = 800;
		}
	}, 40);
}

document.addEventListener('keydown', (e) => {
	if ((e.code == 'Space' || e.code == 'ArrowUp') && posY >= 270) {
		isRun = false;
	}
});

function drawMotobug(){
	ctx.clearRect(posXM + 40, posYM, sizeM, sizeM);
	ctx.drawImage(motobug, posXM, posYM, sizeM, sizeM);
}

function motobugAnimation(){
	intervalM = setInterval(() => {
		posXM -= 30;
		drawMotobug();
	}, 20);
}

function checkCollision(){
	interCol = setInterval(() => {
		sonicX1 = posX;
		sonicX2 = ssX + posX;
		sonicY1 = posY;
		sonicY2 = posY + ssY;

		motobugX1 = posXM;
		motobugX2 = posXM + sizeM;
		motobugY1 = posYM;
		motobugY2 = posYM + sizeM;

		flyBX1 = fbPosX;
		flyBX2 = fbPosX + fbsX;
		flyBY1 = fbPosY;
		flyBY2 = fbPosY + fbsY;

		if((sonicY2 > motobugY1 && sonicX2 > motobugX1 && sonicX1 < motobugX1) 
		|| (sonicY2 > motobugY1 && sonicX1 < motobugX2 && sonicX2 > motobugX2)
		|| (sonicY2 > flyBY1 && sonicX2 > flyBX1 && sonicX1 < flyBX1 && sonicY2 < flyBY2) 
		|| (sonicY2 > flyBY1 && sonicX1 < flyBX2 && sonicX2 > flyBX2 && sonicY2 < flyBY2)
		|| (sonicY1 > flyBY2 && sonicX2 > flyBX1 && sonicX1 < flyBX1 && sonicY1 < flyBY1) 
		|| (sonicY1 < flyBY1 && sonicX1 < flyBX2 && sonicX2 > flyBX2 && sonicY1 > flyBY2)){
			gameStarted = false;

			if(score > hscore){
				hscore = score;
				hscoreDiv.textContent = 'Highscore: ' + hscore;
				localStorage.setItem('hscore', hscore);
			}

			alert("You loose!");
			location.reload();
		}
	}, 20);
}

function drawFlyBadnik(){
	ctx.clearRect(fbPosX + 40, fbPosY, fbsX, fbsY);
	ctx.drawImage(badnikfly, fbPosX, fbPosY, fbsX, fbsY);
}

function badnikFlyAnimation(){
		flyAnimIntr = setInterval(() => {
		fbPosX -= 15;
		drawFlyBadnik();
	}, 25);
}

function enemyAppearence(){
	enemyAp = setInterval(() => {
		chooseRobot = Math.floor(Math.random() * 2);

		switch (chooseRobot){
			case 0:
				sizeM = 45;
				posYM = 305;
				break;
			case 1:
				sizeM = 90;
				posYM = 260;
				break;
		}
		console.log(chooseRobot);
		motobug.src = groundBadnik[chooseRobot];
		posXM = 800;
		fbPosX = 810;

		nextAp = Math.random * (3000 - 500) + 500;
		console.log(nextAp);
	}, nextAp);
}

function updateScore(){
	scoreInterval = setInterval(() => {
		score++;
		scoreDiv.textContent = 'Score: ' + score;
	}, 100)
}

function startGame(){
	if(gameStarted){
		drawGround();
		drawSonic();
		updateScore();
		groundAnimation();
		sonicAnimation();
		setTimeout(motobugAnimation, 2000);
		setTimeout(badnikFlyAnimation, 2000);
		setTimeout(enemyAppearence, 2000);
		checkCollision();
	}
}

buttonCS.addEventListener('click', function() {
	hscore = 0;
	hscoreDiv.textContent = 'Highscore: ' + hscore;
	localStorage.setItem('hscore', hscore);
});

document.addEventListener('keydown', (e) => {
	if (e.code == 'Enter' && !gameStarted) {
		gameStarted = true;
		gamecanvas.style.backgroundImage = "url('sprites/background.png')";
		startGame();
	}
});