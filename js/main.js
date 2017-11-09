let ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '30px Arial';

let	HEIGHT = 500,
	WIDTH = 500,
	startTime = Date.now(),
	frameCount = 0,
	score = 0;

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
}

document.onmousemove = function(mouse) {
	let mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
	let mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;
	
	mouseX -= player.x;
	mouseY -= player.y;
	
	player.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180;
}

update = function() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
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

player = Player();
startNewGame();

setInterval(update, 40);