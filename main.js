const data = {
	inputs: [
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 1]
	],

	outputs: [
		[0],
		[1],
		[1], 
		[0]
	]
};

const neuralNetwork = new NeuralNetwork([2, 2, 2], 2, 1);
let img;

function setup(){
	img = createImage(20, 20);
	createCanvas(400, 400);
}

function draw(){
	background(0);
	for (let i = 0; i < 100; i++){
		neuralNetwork.mini_batch(data, learning_rate=0.1);
	}

	img.loadPixels();
	for (let x = 0; x < img.width; x++){
		for (let y = 0; y < img.height; y++){
			img.set(x, y, color(neuralNetwork.predict([x/img.width, y/img.height]) * 255));
		}
	}
	img.updatePixels();

	image(img, 0, 0, width, height, 0, 0);
	stroke(0);
	fill(255);
	text("Iteration: "+frameCount, 50, 50);
}
