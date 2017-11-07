let ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Arial';

let x = 50,
	spdX = 30,
	y = 40,
	spdY = 5;

ctx.fillText('P', x, y);


setInterval(update, 500);


function update(){
	x += spdX;
	y += spdY;
	ctx.fillText('P', x, y);
	
	if(x > 500){
		console.log('Out of bounds!');
	}	
};