let ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '30px Arial';

let	HEIGHT = 500,
	WIDTH = 500,
	startTime = Date.now(),
	frameCount = 0,
	score = 0;

//entities
let player;
Player = function(){
	let self = Actor('player', 'Player1', 50, 30, 40, 5, 20, 20, 'green', 10, 1);

	self.updatePosition = function(){
		if(self.pressUp)
			self.y -= 10;
		if(self.pressDown)
			self.y += 10;
		if(self.pressLeft)
			self.x -= 10;
		if(self.pressRight)
			self.x += 10;

		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > WIDTH - self.width/2)
			self.x = WIDTH - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > HEIGHT - self.height/2)
			self.y = HEIGHT - self.height/2;
	}

	self.pressUp = false;
	self.pressDown = false;
	self.pressLeft = false;
	self.pressRight = false;
	
	return self;
};

let	enemyList = {},
	upgradeList = {},
	bulletList = {};

Entity = function(id, x, spdX, y, spdY, width, height, color) {
	let self = {
		id : id,
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		width : width,
		height : height,
		color : color,
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	}
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
		
		if(self.x < 0 || self.x > WIDTH){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > HEIGHT){
			self.spdY = -self.spdY;
		}
	}
	self.draw = function(){
		ctx.save();
		ctx.fillStyle = self.color;
		ctx.fillRect(self.x-self.width/2,self.y-self.height/2,self.width,self.height);
		ctx.restore();
	};
	self.testCollision = function(entity) {
		let rect1 = {
			x : self.x - self.width/2,
			y : self.y - self.height/2,
			width : self.width,
			height : self.height,
		};
		let rect2 = {
			x : entity.x - entity.width/2,
			y : entity.y - entity.height/2,
			width : entity.width,
			height : entity.height,
		};

		return testCollisionRect(rect1, rect2);
	}

	return self;
}

Actor = function(type, id, x, spdX, y, spdY, width, height, color, hp, atkSpd){
	var self  = Entity(id, x, spdX, y, spdY, width, height, color);
	self.type = type;
	self.hp = hp;
	self.atkSpd = atkSpd;
	self.aimAngle = 0;
	self.attackCounter = 0;
	self.performAttack = function() {
		if(self.attackCounter > 25){
			generateBullet(self);
			self.attackCounter = 0;
		} 
	};
	self.performSpecialAttack = function() {
		if(self.attackCounter > 100){

			// for (let angle = 0; angle < 360; angle++) {
			// 	generateBullet(self, angle);
			// }
			generateBullet(self,self.aimAngle - 5);
			generateBullet(self,self.aimAngle);
			generateBullet(self,self.aimAngle + 5);

			self.attackCounter = 0;
		}
	}
	let super_update = self.update;
	self.update = function(){
		super_update();
		self.attackCounter+=self.atkSpd;
	}

	return self;
}

enemy = function(id, x, spdX, y, spdY, width, height){
	let self = Actor('enemy', id, x, spdX, y, spdY, width, height, 'red', 10, 1);

	enemyList[id] = self;
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
	let self = Entity(id, x, spdX, y, spdY, width, height, color);
	self.category = category;

	upgradeList[id] = self;
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
	let self = Entity(id, x, spdX, y, spdY, width, height, 'back');	
	self.timer = 0;
	
	bulletList[id] = self;
}

generateBullet = function(actor, aimOverwrite){
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
		let isColiding = player.testCollision(upgradeList[key]);
		if(isColiding){
			if (upgradeList[key].category === 'score')
				score+=1000;
			else
				player.atkSpd += 3;

			delete upgradeList[key];
		}
	}

	for(let key in bulletList){
		bulletList[key].update();

		let toRemove = false;
		bulletList[key].timer++;
		if(bulletList[key].timer > 75)
			toRemove = true;
		
		for(let key2 in enemyList){
			// let isColiding = bulletList[key].testCollision(enemyList[key2]);
			// if(isColiding){
			// 	toRemove = true;
			// 	delete enemyList[key2];
			// 	break;
			// }
		}

		if(toRemove)
			delete bulletList[key];
	}

	for(let key in enemyList){
		enemyList[key].update();
		enemyList[key].performAttack();

		let isColiding = player.testCollision(enemyList[key]);
		if(isColiding)
			player.hp--;
	}

	if(player.hp <= 0){
		let surviveTime = Date.now() - startTime;
		console.log('You lost! You survived ' + surviveTime + ' ms.');
		startNewGame();
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