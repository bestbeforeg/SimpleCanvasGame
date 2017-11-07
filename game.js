let ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Arial';

//player
let player = {
	x: 50,
	spdX : 30,
	y : 40,
	spdY : 5,
	name : 'P',
};

let enemyList = {}
//enemy
let enemy = {
	x : 150,
	spdX : 10,
	y : 350,
	spdY : 15,
	name : 'E',
	id : 'E1',
}
enemyList['E1'] = enemy;

//enemy2
let enemy2 = {
	x : 250,
	spdX : 10,
	y : 350,
	spdY : -15,
	name : 'E',
	id : 'E2',
}
enemyList['E2'] = enemy2;

//enemy3
let enemy3 = {
	x : 11,
	spdX : 10,
	y : 350,
	spdY : 5,
	name : 'E',
	id : 'E3',
}
enemyList['E3'] = enemy3;

let	message = 'Bouncing',
	HEIGHT = 500,
	WIDTH = 500;

setInterval(update, 40);

function update() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	updateEntity(player);
	for(let key in enemyList){
		updateEntity(enemyList[key]);
	}
}

function updateEntity(something){
	//player move
	something.x += something.spdX;
	something.y += something.spdY;
	ctx.fillText(something.name, something.x, something.y);
	
	if(something.x < 0 || something.x > WIDTH){
		console.log(message);
		something.spdX = -something.spdX;
	}
	if(something.y < 0 || something.y > HEIGHT){
		console.log(message);
		something.spdY = -something.spdY;
	}
};
