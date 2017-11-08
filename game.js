let ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Arial';

let	message = 'Bouncing',
	HEIGHT = 500,
	WIDTH = 500,
	startTime = Date.now();

//player
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
};

document.onmousemove = function(mouse) {
	let mouseX = mouse.clientX,
		mouseY = mouse.clientY;

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

update = function() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	for(let key in enemyList){
		updateEntity(enemyList[key]);
		let isColiding = testCollision(player, enemyList[key]);
		if(isColiding){
			player.hp--;
			if(player.hp <= 0){
				let surviveTime = Date.now() - startTime;
				console.log('You lost! You survived ' + surviveTime + ' ms.');
				player.hp = 10;
				startTime = Date.now();
			}
		}
	}

	drawEntity(player);
	ctx.fillText(player.hp + ' HP', 0, 30);
}

drawEntity = function(something){
	ctx.save();
	ctx.fillStyle = something.color;
	ctx.fillRect(something.x - something.width/2, something.y - something.height/2, something.width, something.height);
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

let enemyList = {};
enemy('E1', 150, 10, 350, 15, 30, 30);
enemy('E2', 250, 10, 350, -15, 20, 20);
enemy('E3', 11, 10, 350, 8, 40, 10);

setInterval(update, 40);