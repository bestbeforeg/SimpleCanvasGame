let ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Arial';

let	HEIGHT = 500,
	WIDTH = 500,
	startTime = Date.now(),
	frameCount = 0,
	score = 0;

//entities
let player = {
	x: 50,
	spdX : 30,
	y : 40,
	spdY : 5,
	name : 'P',
	hp : 10,
	width : 20,
	height : 20,
	color : 'green',
},
	enemyList = {},
	upgradeList = {},
	bulletList = {};

document.onmousemove = function(mouse) {
	let mouseX = mouse.clientX - document.getElementById('canvas').getBoundingClientRect().left,
		mouseY = mouse.clientY - document.getElementById('canvas').getBoundingClientRect().top;

	if(mouseX < player.width/2)
		mouseX = player.width/2;
	if(mouseX > WIDTH - player.width/2)
		mouseX = WIDTH - player.width/2;
	if(mouseY < player.height/2)
		mouseY = player.height/2;
	if(mouseY > HEIGHT - player.height/2)
		mouseY = HEIGHT - player.height/2;

	player.x = mouseX;
	player.y = mouseY;
}

testCollision = function(entity1, entity2) {
	let rect1 = {
		x : entity1.x - entity1.width/2,
		y : entity1.y - entity1.height/2,
		width : entity1.width,
		height : entity1.height,
	};
	let rect2 = {
		x : entity2.x - entity2.width/2,
		y : entity2.y - entity2.height/2,
		width : entity2.width,
		height : entity2.height,
	};

	return testCollisionRect(rect1, rect2);
}

testCollisionRect = function(rect1,rect2){
        return rect1.x <= rect2.x+rect2.width
                && rect2.x <= rect1.x+rect1.width
                && rect1.y <= rect2.y + rect2.height
                && rect2.y <= rect1.y + rect1.height;
}

enemy = function(id, x, spdX, y, spdY, width, height){
	let enemy = {
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		name : 'E',
		id : id,
		width : width,
		height : height,
		color : 'red',
	}
	enemyList[id] = enemy;
}

upgrade = function(id, x, spdX, y, spdY, width, height){
	let upgrade = {
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		id : id,
		width : width,
		height : height,
		color : 'orange',
	}
	upgradeList[id] = upgrade;
}

bullet = function(id, x, spdX, y, spdY, width, height){
	let bullet = {
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		id : id,
		width : width,
		height : height,
		color : 'black',
	}
	bulletList[id] = bullet;
}

randomlyGenerateEnemy = function(){
	let x = Math.random()*WIDTH,
		y = Math.random()*HEIGHT,
		width = 10 + Math.random()*30,
		height = 10 + Math.random()*30,
		spdX = 5 + Math.random()*5,
		spdY = 5 + Math.random()*5,
		id = Math.random();

	enemy(id, x, spdX, y, spdY, width, height);
}

randomlyGenerateUpgrade = function(){
	let x = Math.random()*WIDTH,
		y = Math.random()*HEIGHT,
		width = 10,
		height = 10,
		spdX = 0,
		spdY = 0,
		id = Math.random();

	upgrade(id, x, spdX, y, spdY, width, height);
}

randomlyGenerateBullet = function(){
	let x = player.x,
		y = player.y,
		width = 5,
		height = 5,
		angle = Math.random()*360,
		spdX = Math.sin(angle/180*Math.PI)*5,
		spdY = Math.cos(angle/180*Math.PI)*5,
		id = Math.random();

	bullet(id, x, spdX, y, spdY, width, height);
}

drawEntity = function(something){
	ctx.save();
	ctx.fillStyle = something.color;
	ctx.fillRect(something.x-something.width/2,something.y-something.height/2,something.width,something.height);
	ctx.restore();
};

updateEntityPosition = function(something){
	something.x += something.spdX;
	something.y += something.spdY;
	
	if(something.x < 0 || something.x > WIDTH){
		something.spdX = -something.spdX;
	}
	if(something.y < 0 || something.y > HEIGHT){
		something.spdY = -something.spdY;
	}
}

updateEntity = function(something){
	updateEntityPosition(something);
	drawEntity(something);
};

update = function() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	frameCount++;
	score++;

	if(frameCount % 100 == 0)
		randomlyGenerateEnemy();

	for(let key in enemyList){
		updateEntity(enemyList[key]);
		let isColiding = testCollision(player, enemyList[key]);
		if(isColiding)
			player.hp--;
	}

	if(frameCount % 75 == 0)
		randomlyGenerateUpgrade();

	for(let key in upgradeList){
		updateEntity(upgradeList[key]);
		let isColiding = testCollision(player, upgradeList[key]);
		if(isColiding){
			score+=1000;
			delete upgradeList[key];
		}
	}

	if(frameCount % 25 == 0)
		randomlyGenerateBullet();

	for(let key in bulletList){
		updateEntity(bulletList[key]);
		// let isColiding = testCollision(player, upgradeList[key]);
		// if(isColiding){
		// 	score+=1000;
		// 	delete upgradeList[key];
		// }
	}

	// for(let key in bulletList){
	// 	updateEntity(bulletList[key]);
	// 	let isColiding = testCollision(player, upgradeList[key]);
	// 	if(isColiding){
	// 		score+=1000;
	// 		delete upgradeList[key];
	// 	}
	// }
	

	if(player.hp <= 0){
		let surviveTime = Date.now() - startTime;
		console.log('You lost! You survived ' + surviveTime + ' ms.');
		startNewGame();
	}

	drawEntity(player);
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
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
}

startNewGame();

setInterval(update, 40);