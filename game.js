let ctx = document.getElementById('ctx').getContext('2d');
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
	atkSpd : 1,
	attackCounter : 0,
	pressUp : false,
	pressDown : false,
	pressLeft : false,
	pressRight : false,
	aimAngle : 0,
},
	enemyList = {},
	upgradeList = {},
	bulletList = {};



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
		aimAngle : 0,
	}
	enemyList[id] = enemy;
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

upgrade = function(id, x, spdX, y, spdY, width, height, color, category){
	let upgrade = {
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		id : id,
		width : width,
		height : height,
		color : color,
		category : category,
	}
	upgradeList[id] = upgrade;
}

randomlyGenerateUpgrade = function(){
	let x = Math.random()*WIDTH,
		y = Math.random()*HEIGHT,
		width = 10,
		height = 10,
		spdX = 0,
		spdY = 0,
		id = Math.random(),
		color,
		category;

	if(Math.random() < 0.5){
		color = 'orange';
		category = 'score'; 
	}
	else{
		color = 'purple';
		category = 'attack'; 
	}

	upgrade(id, x, spdX, y, spdY, width, height, color, category);
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
		timer : 0,
	}
	bulletList[id] = bullet;
}

randomlyGenerateBullet = function(actor, aimOverwrite){
	let x = actor.x,
		y = actor.y,
		width = 5,
		height = 5,
		angle = actor.aimAngle;

	if(aimOverwrite !== undefined)
		angle = aimOverwrite;

	let spdX = Math.cos(angle/180*Math.PI)*5,
		spdY = Math.sin(angle/180*Math.PI)*5,
		id = Math.random();

	bullet(id, x, spdX, y, spdY, width, height);
}

updateEntity = function(something){
	updateEntityPosition(something);
	drawEntity(something);
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

drawEntity = function(something){
	ctx.save();
	ctx.fillStyle = something.color;
	ctx.fillRect(something.x-something.width/2,something.y-something.height/2,something.width,something.height);
	ctx.restore();
};

document.onclick = function(mouse){
	if(player.attackCounter > 25){
		randomlyGenerateBullet(player);
		player.attackCounter = 0;
	}
}

document.oncontextmenu = function(mouse){
	if(player.attackCounter > 100){

		for (let angle = 0; angle < 360; angle++) {
			randomlyGenerateBullet(player, angle);
		}

		player.attackCounter = 0;
	}
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

updatePlayerPosition = function() {
	if(player.pressUp)
		player.y -= 10;
	if(player.pressDown)
		player.y += 10;
	if(player.pressLeft)
		player.x -= 10;
	if(player.pressRight)
		player.x += 10;

	if(player.x < player.width/2)
		player.x = player.width/2;
	if(player.x > WIDTH - player.width/2)
		player.x = WIDTH - player.width/2;
	if(player.y < player.height/2)
		player.y = player.height/2;
	if(player.y > HEIGHT - player.height/2)
		player.y = HEIGHT - player.height/2;
}

update = function() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	frameCount++;
	score++;
	
	if(frameCount % 100 == 0)
		randomlyGenerateEnemy();

	if(frameCount % 75 == 0)
		randomlyGenerateUpgrade();	

	player.attackCounter+=player.atkSpd;
	
	for(let key in upgradeList){
		updateEntity(upgradeList[key]);
		let isColiding = testCollision(player, upgradeList[key]);
		if(isColiding){
			if (upgradeList[key].category === 'score')
				score+=1000;
			else
				player.atkSpd += 3;

			delete upgradeList[key];
		}
	}

	for(let key in bulletList){
		updateEntity(bulletList[key]);

		let toRemove = false;
		bulletList[key].timer++;
		if(bulletList[key].timer > 75)
			toRemove = true;
		
		for(let key2 in enemyList){
			let isColiding = testCollision(bulletList[key], enemyList[key2]);
			if(isColiding){
				toRemove = true;
				delete enemyList[key2];
				break;
			}
		}

		if(toRemove)
			delete bulletList[key];
	}

	for(let key in enemyList){
		updateEntity(enemyList[key]);
		let isColiding = testCollision(player, enemyList[key]);
		if(isColiding)
			player.hp--;
	}

	if(player.hp <= 0){
		let surviveTime = Date.now() - startTime;
		console.log('You lost! You survived ' + surviveTime + ' ms.');
		startNewGame();
	}

	updatePlayerPosition();
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
	bulletList = {};
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
	randomlyGenerateEnemy();
}

startNewGame();

setInterval(update, 40);