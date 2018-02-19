class NeuralNetwork {
	constructor(input_size, shape, output_size){
			this.layers = shape.length;
			this.input_size = input_size;
			this.shape = shape;
			this.output_size = output_size;
			this.W = this.init_weights(shape);
			this.func = this.init_funcs();
	}

	init_weights(shape){
		const weights = [];

		weights.push(Matrix.random(shape[0], this.input_size))

		for (let i = 1; i < shape.length; i++){
			weights.push(Matrix.random(shape[i], shape[i-1]));
		}

		weights.push(Matrix.random(this.output_size, shape[shape.length - 1]))

		return weights;
	}

	init_funcs(){
		for (let i = 0; i < this.W.length; i++){
			
		}
	}

	forward_propagation(input){
		const input_vector = new Matrix([input]).transpose();

		for ()
	}
}