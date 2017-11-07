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
	

//enemy
let enemy = {
	x : 150,
	spdX : 10,
	y : 350,
	spdY : 15,
	name : 'E',
}

let	message = 'Bouncing',
	HEIGHT = 500,
	WIDTH = 500;

setInterval(update, 40);

function update() {
	updateEntity(player);
	updateEntity(enemy);
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
