class ActivationFunction {
	constructor(func, derivative){
		this.function = func;
		this.derivative = derivative;
	}

	apply(matrix){
		return this.function(matrix);
	}

	applyDerivative(matrix){
		return this.derivative(matrix);
	}
}

class NeuralNetwork {
	constructor(shape, input_size, output_size){
			this.input_size = input_size;
			this.shape = shape;
			this.output_size = output_size;
			this.weights = this.init_weights(this.shape);
			this.layers = this.weights.length;
			this.biases = this.init_biases(this.shape);
			this.funcs = this.init_funcs(this.shape);
			this.numberEdges = this.calculateNumberEdges();
			this.numberNeurons = this.calculateNumberNeurons();
	}

	init_weights(shape){
		const weights = [];

		weights.push(Matrix.random(shape[0], this.input_size));

		for (let i = 1; i < shape.length; i++){
			weights.push(Matrix.random(shape[i], shape[i-1]));
		}

		weights.push(Matrix.random(this.output_size, shape[shape.length - 1]))

		return weights;
	}

	calculateNumberEdges(){
		return this.weights.reduce((acc, curr) => {
			return acc + curr.size();
		}, 0)
	}

	calculateNumberNeurons(){
		return this.shape.reduce((acc, curr) => {
			return acc + curr;
		}, 0);
	}

	init_funcs(shape){
		return new Array(this.layers).fill(NeuralNetwork.DEFAULT_FUNCTION);
	}

	init_biases(shape){
		const biases = [];

		biases.push(Matrix.random(this.input_size, 1));

		for (let layer of shape){
			biases.push(Matrix.random(layer[0], 1));
		}

		return biases;
	}

	predict(input){
		let activation = new Matrix([input]).transpose();

		for (let l = 0; l < this.layers; l++){
			const weight = this.weights[l];
			const bias = this.biases[l];
			const z = weight.dot(activation).add(bias);
			activation = this.funcs[l].apply(z);
		}

		return activation.transpose().data[0];
	}

	mini_batch(data, learning_rate){
		let {inputs, outputs} = data;
		const numTrain = inputs.length;
		//TODO: BETTER LEARNING RATE OPTIMIZATION
		learning_rate = learning_rate / numTrain * Math.pow(this.numberNeurons, 2);

		if (numTrain === 0){
			return;
		}

		let nabla_b = this.biases.map(bias => Matrix.zeroes(bias.rows, bias.cols));
		let nabla_w = this.weights.map(weight => Matrix.zeroes(weight.rows, weight.cols));
		
		for (let i = 0; i < numTrain; i++){
			let x = new Matrix([inputs[i]]).transpose();
			let y = new Matrix([outputs[i]]).transpose();

			let [delta_nabla_b, delta_nabla_w] = this.backprop(x, y);

			for (let i = 0; i < nabla_b.length; i++){
				nabla_b[i].add(delta_nabla_b[i]);
			}  

			for (let i = 0; i < nabla_w.length; i++){
				nabla_w[i].add(delta_nabla_w[i]);
			}
		}

		for (let i = 0; i < this.weights.length; i++){
			const nw = nabla_w[i];
			this.weights[i] = this.weights[i].sub(nw.multiply(learning_rate));
		}

		for (let i = 0; i < this.biases.length; i++){
			const nb = nabla_b[i];
			this.biases[i] = this.biases[i].sub(nb.multiply(learning_rate));
		}
	}

	backprop(x, y){
		let nabla_b = this.biases.map(bias => Matrix.zeroes(bias.rows, bias.cols));
		let nabla_w = this.weights.map(weight => Matrix.zeroes(weight.rows, weight.cols));

		let activation = x;
		const activations = [x];
		const zs = [];

		for (let l = 0; l < this.layers; l++){
			const weight = this.weights[l];
			const bias = this.biases[l];
			const z = weight.dot(activation).add(bias);
			zs.push(z);
			activation = this.funcs[l].apply(z);
			activations.push(activation);
		}

		let delta = Matrix.sub(activations[activations.length - 1], y)
						.multiply(this.funcs[zs.length - 1].applyDerivative(zs[zs.length - 1]));

		nabla_b[nabla_b.length - 1] = delta;
		nabla_w[nabla_w.length - 1] = delta.dot(activations[activations.length - 2].transpose());

		for (let l = 2; l <= this.layers; l++){
			const z = zs[zs.length - l];
			const sp = this.funcs[zs.length - 1].applyDerivative(z);

			delta = this.weights[this.layers - l + 1].transpose().dot(delta).multiply(sp);

			nabla_b[nabla_b.length - l] = delta;
			nabla_w[nabla_w.length - l] = delta.dot(activations[activations.length - l - 1].transpose());
		}

		return [nabla_b, nabla_w];
	}

	static cost_function(prediction, y){
		return Matrix.sub(prediction, y)
				.square()
				.average();
	}
}

NeuralNetwork.DEFAULT_FUNCTION = new ActivationFunction(Matrix.sigmoid, Matrix.sigmoid_prime);