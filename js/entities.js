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
	self.pressUp = false;
	self.pressDown = false;
	self.pressLeft = false;
	self.pressRight = false;
	self.maxMoveSpd = 3;
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
	self.updatePosition = function(){
		let bumpLeft = {x : self.x - 40, y : self.y},
			bumpRight = {x : self.x + 40, y : self.y},
			bumpUp = {x : self.x, y : self.y - 16},
			bumpDown = {x : self.x, y : self.y + 64};

		
		if(Maps.current.isPositionWall(bumpUp)){
			self.y += 5;
		}
		else{
			if(self.pressUp)
				self.y -= self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(bumpDown)){
			self.y -= 5;
		}
		else{
			if(self.pressDown)
				self.y += self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(bumpLeft)){
			self.x += 5;
		}else{
			if(self.pressLeft)
				self.x -= self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(bumpRight)){
			self.x -= 5;
		}
		else{
			if(self.pressRight)
				self.x += self.maxMoveSpd;
		}

		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > Maps.current.width - self.width/2)
			self.x = Maps.current.width - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > Maps.current.height - self.height/2)
			self.y = Maps.current.height - self.height/2;
	}
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
	let self = Actor('player', 'Player1', 50, 40, 50*1.5, 70*1.5, Img.player, 10, 1);
	self.maxMoveSpd = 10;	
	self.pressMouseRight = false;
	self.pressMouseLeft = false;

	self.onDeath = function(){
		let surviveTime = Date.now() - startTime;
		console.log('You lost! You survived ' + surviveTime + ' ms.');
		startNewGame();
	}

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
	self.updateKeyPress = function(){
		let difX = player.x - self.x;
		let difY = player.y - self.y;

		self.pressRight = difX > 3;
		self.pressLeft = difX < -3;
		self.pressUp = difY < -3;
		self.pressDown = difY > 3;
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
	self.onDeath = function () {
		self.isDead = true;
	}

	let super_update = self.update;
	self.update = function(){
		super_update();
		self.walkingAnim += 0.2;
		self.updateAim();
		self.updateKeyPress();
		self.performAttack();
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
	let x = Math.random()*Maps.current.width,
		y = Math.random()*Maps.current.height,
		width = 64*1.5,
		height = 64*1.5,
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
	let x = Math.random()*Maps.current.width,
		y = Math.random()*Maps.current.height,
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
		
		if(self.x < 0 || self.x > Maps.current.width){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > Maps.current.height){
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
		if(Maps.current.isPositionWall(self))	
			toRemove = true;

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