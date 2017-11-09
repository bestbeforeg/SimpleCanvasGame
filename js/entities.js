let player;
Player = function(){
	let self = Actor('player', 'Player1', 50, 30, 40, 5, 30, 45, Img.player, 10, 1);

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

	let super_update = self.update;
	self.update = function(){
		super_update();
		if(self.hp <= 0){
			let surviveTime = Date.now() - startTime;
			console.log('You lost! You survived ' + surviveTime + ' ms.');
			startNewGame();
		}
	}
	
	return self;
};

let	enemyList = {},
	upgradeList = {},
	bulletList = {};

Entity = function(id, x, spdX, y, spdY, width, height, img) {
	let self = {
		id : id,
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		width : width,
		height : height,
		img : img,
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
		let x = self.x-self.width/2;
		let y = self.y-self.height/2;
		ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height, x, y, self.width, self.height);
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

Actor = function(type, id, x, spdX, y, spdY, width, height, img, hp, atkSpd){
	var self  = Entity(id, x, spdX, y, spdY, width, height, img);
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
	let self = Actor('enemy', id, x, spdX, y, spdY, width, height, Img.enemy, 10, 1);

	let super_update = self.update;
	self.update = function(){
		super_update();
		self.performAttack();

		let isColiding = player.testCollision(self);
		if(isColiding)
			player.hp--;
	}

	enemyList[id] = self;
}

randomlyGenerateEnemy = function(){
	let x = Math.random()*WIDTH,
		y = Math.random()*HEIGHT,
		width = 50,
		height = 50,
		spdX = 5 + Math.random()*5,
		spdY = 5 + Math.random()*5,
		id = Math.random();

	enemy(id, x, spdX, y, spdY, width, height);
}

upgrade = function(id, x, spdX, y, spdY, width, height, img, category){
	let self = Entity(id, x, spdX, y, spdY, width, height, img);
	self.category = category;

	let super_update = self.update;
	self.update = function(){
		super_update();
		let isColiding = player.testCollision(self);
		if(isColiding){
			if (self.category === 'score')
				score+=1000;
			else
				player.atkSpd += 3;

			delete upgradeList[self.id];
		}
	}

	upgradeList[id] = self;
}

randomlyGenerateUpgrade = function(){
	let x = Math.random()*WIDTH,
		y = Math.random()*HEIGHT,
		width = 15,
		height = 15,
		spdX = 0,
		spdY = 0,
		id = Math.random(),
		img,
		category;

	if(Math.random() < 0.5){
		img = Img.upgrade1;
		category = 'score'; 
	}
	else{
		img = Img.upgrade2;
		category = 'attack'; 
	}

	upgrade(id, x, spdX, y, spdY, width, height, img, category);
}

bullet = function(id, x, spdX, y, spdY, width, height){
	let self = Entity(id, x, spdX, y, spdY, width, height, Img.bullet);	
	self.timer = 0;

	let super_update = self.update;
	self.update = function(){
		super_update();
		
		let toRemove = false;
		self.timer++;
		if(self.timer > 75)
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
			delete bulletList[self.id];
	}
	
	bulletList[id] = self;
}

generateBullet = function(actor, aimOverwrite){
	let x = actor.x,
		y = actor.y,
		width = 10,
		height = 10,
		angle = actor.aimAngle;

	if(aimOverwrite !== undefined)
		angle = aimOverwrite;

	let spdX = Math.cos(angle/180*Math.PI)*5,
		spdY = Math.sin(angle/180*Math.PI)*5,
		id = Math.random();

	bullet(id, x, spdX, y, spdY, width, height);
}