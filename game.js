let ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Arial';

//player
let x = 50,
	spdX = 30,
	y = 40,
	spdY = 5,
	name = 'P';
	

//enemy
let enemy_x = 150,
	enemy_spdX = 10,
	enemy_y = 350,
	enemy_spdY = 15,
	enemy_name = 'E';

let	message = 'Bouncing',
	HEIGHT = 500,
	WIDTH = 500;

setInterval(update, 40);


function update(){
	//player move
	x += spdX;
	y += spdY;
	ctx.fillText(name, x, y);
	
	if(x < 0 || x > WIDTH){
		console.log(message);
		spdX = -spdX;
	}
	if(y < 0 || y > HEIGHT){
		console.log(message);
		spdY = -spdY;
	}

	//enemy move
	enemy_x += enemy_spdX;
	enemy_y += enemy_spdY;
	ctx.fillText(enemy_name, enemy_x, enemy_y);
	
	if(enemy_x < 0 || enemy_x > WIDTH){
		console.log(message);
		enemy_spdX = -enemy_spdX;
	}
	if(enemy_y < 0 || enemy_y > HEIGHT){
		console.log(message);
		enemy_spdY = -enemy_spdY;
	}
};