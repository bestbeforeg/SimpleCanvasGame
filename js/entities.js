Entity = function(id, x, y, width, height, img) {
	let self = {
		id : id,
		x : x,
		y : y,
		width : width,
		height : height,
		img : img,
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	}
	self.updatePosition = function(){};
	self.draw = function(){
		ctx.save();
		let x = self.x - player.x;
		let y = self.y -player.y;

		x += WIDTH/2;
		y += HEIGHT/2;

		x -= self.width/2;
		y -= self.height/2;

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

Actor = function(type, id, x, y, width, height, img, hp, atkSpd){
	var self  = Entity(id, x, y, width, height, img);
	self.type = type;
	self.hp = hp;
	self.hpMax = hp;
	self.atkSpd = atkSpd;
	self.aimAngle = 0;
	self.attackCounter = 0;
	self.onDeath = function(){};
	self.performAttack = function() {
		if(self.attackCounter > 25){
			Bullet.generate(self);
			self.attackCounter = 0;
		} 
	};
	self.performSpecialAttack = function() {
		if(self.attackCounter > 100){
			Bullet.generate(self,self.aimAngle - 5);
			Bullet.generate(self,self.aimAngle);
			Bullet.generate(self,self.aimAngle + 5);

			self.attackCounter = 0;
		}
	}
	self.walkingAnim = 0;
	self.draw = function(){
		ctx.save();
		let x = self.x - player.x;
		let y = self.y -player.y;
		

		x += WIDTH/2;
		y += HEIGHT/2;

		x -= self.width/2;
		y -= self.height/2;

		let frameWidth = self.img.width/3;
		let frameHeight = self.img.height/4;
		var direction = 3;
		if(self.aimAngle < 0)
			self.aimAngle += 360;
		if(self.aimAngle >= 45 && self.aimAngle < 135 )
			direction = 2;
		if(self.aimAngle >= 135 && self.aimAngle < 225 )
			direction = 1;
		if(self.aimAngle >= 225 && self.aimAngle < 315 )
			direction = 0;

		let walking = Math.floor(self.walkingAnim) % 3;

		ctx.drawImage(self.img, walking*frameWidth, direction*frameHeight, frameWidth, frameHeight, x, y, self.width, self.height);
		ctx.restore();
	};
	let super_update = self.update;
	self.update = function(){
		super_update();
		self.attackCounter+=self.atkSpd;
		if(self.hp <= 0)
			self.onDeath();
	}

	return self;
}

let player;
Player = function(){
	let self = Actor('player', 'Player1', 50, 40, 50, 70, Img.player, 10, 1);
	let super_update = self.update;
	self.update = function () {
		super_update();
		if(self.pressUp || self.pressDown || self.pressLeft || self.pressRight)
			self.walkingAnim += 0.2;
		if(self.pressMouseLeft)
			self.performAttack();
		if(self.pressMouseRight)
			self.performSpecialAttack();
	}
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
		if(self.x > currentMap.width - self.width/2)
			self.x = currentMap.width - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > currentMap.height - self.height/2)
			self.y = currentMap.height - self.height/2;
	}

	self.pressUp = false;
	self.pressDown = false;
	self.pressLeft = false;
	self.pressRight = false;
	self.pressMouseRight = false;
	self.pressMouseLeft = false;
	self.onDeath = function(){
		let surviveTime = Date.now() - startTime;
		console.log('You lost! You survived ' + surviveTime + ' ms.');
		startNewGame();
	}
	
	return self;
};

Enemy = function(id, x, y, width, height, img, hp, atkSpd){
	let self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd);
	Enemy.List[id] = self;
	self.isDead = false;
	self.updateAim = function(){
		let difX = player.x - self.x;
		let difY = player.y - self.y;

		self.aimAngle = Math.atan2(difY, difX) / Math.PI * 180;
	}
	self.updatePosition = function(){
		let difX = player.x - self.x;
		let difY = player.y - self.y;

		if(difX > 0)
			self.x += 3;
		else
			self.x -= 3;

		if(difY > 0)
			self.y += 3;
		else
			self.y -= 3;
	}
	let super_draw = self.draw;
	self.draw = function () {
		super_draw();
		let x = self.x - player.x + WIDTH/2;
		let y = self.y - player.y + HEIGHT/2 - 20;

		ctx.save();
		ctx.fillStyle = 'red';
		let width = 100*self.hp/self.hpMax;
		if(width < 0)
			width = 0;
		ctx.fillRect(x - 50, y - 25, width, 10)
		ctx.strokeSyle = 'black';
		ctx.strokeRect(x - 50, y - 25, width, 10); 

		ctx.restore();


	}
	let super_update = self.update;
	self.update = function(){
		super_update();
		self.walkingAnim += 0.2;
		self.performAttack();
		self.updateAim();	
	}
	self.onDeath = function () {
		self.isDead = true;
	};
}

Enemy.List = {};

Enemy.update = function () {
	if(frameCount % 100 == 0)
		Enemy.randomlyGenerate();
	for(let key in Enemy.List){
		Enemy.List[key].update();
	}
	for(let key in Enemy.List){
		if(Enemy.List[key].isDead)
		delete Enemy.List[key];
	}
}

Enemy.randomlyGenerate = function(){
	let x = Math.random()*currentMap.width,
		y = Math.random()*currentMap.height,
		width = 64,
		height = 64,
		id = Math.random();

	if(Math.random() < 0.5){
		Enemy(id, x, y, width, height, Img.bat, 2, 1);
	}
	else{
		Enemy(id, x, y, width, height, Img.bee, 1, 3);
	}
}

Upgrade = function(id, x, y, width, height, img, category){
	let self = Entity(id, x, y, width, height, img);
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

			delete Upgrade.List[self.id];
		}
	}

	Upgrade.List[id] = self;
}

Upgrade.List = {};

Upgrade.randomlyGenerate = function(){
	let x = Math.random()*currentMap.width,
		y = Math.random()*currentMap.height,
		width = 30,
		height = 30,
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

	Upgrade(id, x, y, width, height, img, category);
}

Upgrade.update = function () {
	if(frameCount % 75 == 0)
		Upgrade.randomlyGenerate();
		
	for(let key in Upgrade.List){
		Upgrade.List[key].update();
	}
};

Bullet = function(id, x, spdX, y, spdY, width, height, combatType){
	let self = Entity(id, x, y, width, height, Img.bullet);	
	self.timer = 0;
	self.combatType = combatType;
	self.spdX = spdX;
	self.spdY = spdY;

	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
		
		if(self.x < 0 || self.x > currentMap.width){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > currentMap.height){
			self.spdY = -self.spdY;
		}
	}

	let super_update = self.update;
	self.update = function(){
		super_update();
		
		let toRemove = false;
		self.timer++;
		if(self.timer > 75)
			toRemove = true;
		
		if(self.combatType === 'player'){
			for(let key in Enemy.List){
				let isColiding = self.testCollision(Enemy.List[key]);
				if(isColiding){
					toRemove = true;
					Enemy.List[key].hp --;
					break;
				}
			}
		}
		else{
			let isColiding = self.testCollision(player);
			if(isColiding){
				toRemove = true;
				player.hp--;
			}
		}

		if(toRemove)
			delete Bullet.List[self.id];
	}
	
	Bullet.List[id] = self;
}

Bullet.List = {};

Bullet.generate = function(actor, aimOverwrite){
	let x = actor.x,
		y = actor.y,
		width = 20,
		height = 20,
		angle = actor.aimAngle;

	if(aimOverwrite !== undefined)
		angle = aimOverwrite;

	let spdX = Math.cos(angle/180*Math.PI)*5,
		spdY = Math.sin(angle/180*Math.PI)*5,
		id = Math.random();

	Bullet(id, x, spdX, y, spdY, width, height, actor.type);
}

Bullet.update = function () {
	for(let key in Bullet.List){
		Bullet.List[key].update();
	}
}