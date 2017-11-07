let ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Arial';

let	message = 'Bouncing',
	HEIGHT = 500,
	WIDTH = 500;

//player
let player = {
	x: 50,
	spdX : 30,
	y : 40,
	spdY : 5,
	name : 'P',
};

getDistanceBetweenEntities = function(entity1,entity2){
	let distanceX = entity1.x - entity2.x;
	let distanceY = entity1.y - entity2.y;
	return Math.sqrt(distanceX*distanceX + distanceY*distanceY);
}

testCollision = function(entity1, entity2) {
	let colision = getDistanceBetweenEntities(entity1, entity2);
	return colision < 30;
}

enemy = function(id, x, spdX, y, spdY){
	let enemy = {
		x : x,
		spdX : spdX,
		y : y,
		spdY : spdY,
		name : 'E',
		id : id,
	}
	enemyList[id] = enemy;
}

update = function() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	for(let key in enemyList){
		updateEntity(enemyList[key]);
		let isColiding = testCollision(player, enemyList[key]);
		if(isColiding){
			console.log('Colliding')
		}
	}

	updateEntity(player);
}

drawEntity = function(something){
	ctx.fillText(something.name, something.x, something.y);
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
enemy('E1', 150, 10, 350, 15);
enemy('E2', 250, 10, 350, -15);
enemy('E3', 11, 10, 350, 8);

setInterval(update, 40);