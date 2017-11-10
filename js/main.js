let ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '30px Arial';

let	HEIGHT = 500,
	WIDTH = 500,
	startTime = Date.now(),
	frameCount = 0,
	score = 0,
	pause = false;

let Img = {};
Img.player = new Image();
Img.player.src = './img/player.png';
Img.bat = new Image();
Img.bat.src = './img/bat.png';
Img.bee = new Image();
Img.bee.src = './img/bee.png';
Img.upgrade1 = new Image();
Img.upgrade1.src = './img/upgrade1.png';
Img.upgrade2 = new Image();
Img.upgrade2.src = './img/upgrade2.png';
Img.bullet = new Image();
Img.bullet.src = './img/bullet.png';

testCollisionRect = function(rect1,rect2){
        return rect1.x <= rect2.x+rect2.width
                && rect2.x <= rect1.x+rect1.width
                && rect1.y <= rect2.y + rect2.height
                && rect2.y <= rect1.y + rect1.height;
}

document.onclick = function(mouse){
	player.performAttack();
}

document.oncontextmenu = function(mouse){
	player.performSpecialAttack();
	mouse.preventDefault();
}

document.onkeydown = function(event){
	if(event.keyCode === 87)
		player.pressUp = true;
	if(event.keyCode === 83)
		player.pressDown = true;
	if(event.keyCode === 65)
		player.pressLeft = true;
	if(event.keyCode === 68)
		player.pressRight = true;
}

document.onkeyup = function(event){
	if(event.keyCode === 87)
		player.pressUp = false;
	if(event.keyCode === 83)
		player.pressDown = false;
	if(event.keyCode === 65)
		player.pressLeft = false;
	if(event.keyCode === 68)
		player.pressRight = false;
	if(event.keyCode === 80)
		pause = !pause;
}

document.onmousemove = function(mouse) {
	let mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
	let mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;
	
	mouseX -= WIDTH/2;
	mouseY -= HEIGHT/2;
	
	player.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180;
}

update = function() {
	if(pause){
		ctx.fillText('Paused', WIDTH/2, HEIGHT/2);
		return;
	}
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	currentMap.draw();
	frameCount++;
	score++;

	if(frameCount % 100 == 0)
		randomlyGenerateEnemy();

	if(frameCount % 75 == 0)
		randomlyGenerateUpgrade();
	
	for(let key in upgradeList){
		upgradeList[key].update();
	}

	for(let key in bulletList){
		bulletList[key].update();
	}

	for(let key in enemyList){
		enemyList[key].update();
	}
	for(let key in enemyList){
		if(enemyList[key].isDead)
		delete enemyList[key];
	}

	player.update();

	ctx.fillText(player.hp + ' HP', 0, 30);
	ctx.fillText('Score: ' + score, 200, 30);
}

startNewGame = function(){
	player.hp = 10;
	startTime = Date.now();
	frameCount = 0;
	score = 0;
	enemyList = {};
	upgradeList = {};
	bulletList = {};
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
}

maps = function(id, imgSrc, width, height){
	let self = {
		id : id,
		img : new Image(),
		width : width,
		height : height,
	}
	self.img.src = imgSrc;
	self.draw = function(){
		let x = WIDTH/2 - player.x;
		let y = WIDTH/2 - player.y;
		ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height, x, y, self.img.width*2, self.img.height*2);
	}
	return self;
}

let currentMap = maps('field', './img/map.png', 1280, 960);
player = Player();
startNewGame();

setInterval(update, 40);