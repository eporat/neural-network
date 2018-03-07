class Matrix {
    constructor(data) {
        this.data = data;
        this.rows = data.length;
        this.cols = data[0].length;
    }

    //Setters and getters
    set(row, column, value) {
        this.data[row][column] = value;
    }

    setRow(index, row){
        if (row instanceof Matrix){
            this.data[index] = row.data[0];
        }
        this.data[index] = row;
    }

    get(row, column) {
        return this.data[row][column];
    }

    getRow(index){
        return this.data[index];
    }

    size(){
        return this.rows * this.cols;
    }

    //Second-order functions
    map(func) {
        this.data = this.data.map((row, i) => {
            return row.map((entry, j) => {
                return func(entry, i, j);
            });
        });
    }

    elementwise(x, func) {
        if (x instanceof Function){
            this.map(entry => x(entry));
        }

        if (typeof(x) === "number") {
            this.map(entry => func(entry, x));
        }

        if (x instanceof Matrix) {
            if (Matrix.compareDimensions(this, x)) {
                this.map((entry, i, j) => func(entry, x.get(i, j)));
            }
        }

        return this;
    }

    //Arithmetic operations
    add(x) {
        return this.elementwise(x, (a, b) => a + b);
    }

    sub(x){
        return this.elementwise(x, (a, b) => a - b);
    }

    multiply(x) {
        return this.elementwise(x, (a, b) => a * b);
    }

    div(x) {
        return this.elementwise(x, (a, b) => a / b);
    }

    square(){
        return this.multiply(this);
    }

    dot(m) {
        if (this.cols == m.rows){
          let multipliedData = new Array(this.rows)
              .fill()
              .map(() => new Array(m.cols).fill(0));

          for (let i = 0; i < this.rows; i++){
              for (let j = 0; j < m.cols; j++){
                  let sum = 0;
                  for (let k = 0; k < this.cols; k++){
                      sum += this.get(i, k) * m.get(k, j);
                  }
                  multipliedData[i][j] = sum;
              }
          }

          return new Matrix(multipliedData);
        }
    }

    multiplyRow(row, x){
        for (let i = 0; i < this.cols; i++){
            this.set(row, i, this.get(row, i)*x);
        }
    }

    addMultiplyOfRow(a, b, c){
        for (let i = 0; i < this.cols; i++){
            this.set(a, i, this.get(a, i)+c*this.get(b, i));
        }
    }

    //Special operations
    swap(i, j){
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    transpose() {
        const transposeArray = (array) => {
            return array[0].map((col, i) => {
                return array.map(row => row[i]);
            });
        };

        return new Matrix(transposeArray(this.data));
    }

    trace() {
        if (Matrix.isSquare(this)) {
            return this.data.reduce((prev, row, idx) => {
                return prev + this.get(idx, idx);
            }, 0);
        }
    }

    productDiagonal() {
        if (Matrix.isSquare(this)) {
            return this.data.reduce((prev, row, idx) => {
                return prev * this.get(idx, idx);
            }, 1);
        }
    }
    
    sum(){
        return this.data.reduce((sumMatrix, row) => {
            return sumMatrix + row.reduce((sumRow, element) => {
                return sumRow + element;
            }, 0)
        }, 0);    
    }

    average(){
        return this.sum() / this.size();
    }

    minor(i, j) {
        return new Matrix(
            this.data.slice(0, i).concat(this.data.slice(i + 1))
                .map(row => row.slice(0, j).concat(row.slice(j + 1)))
        );
    }

    //Cloning
    clone() {
        return new Matrix(clone2DArray(this.data));
    }

    //Printing
    print() {
        console.table(this.data);
    }

    //Partition
    partition(from_i, to_i, from_j, to_j){
        return new Matrix(
            this.data.slice(from_i, to_i)
            .map(row => row.slice(from_j, to_j))
        );
    }

    //Static functions
    static map(matrix, func){
        return matrix.clone().map(func);
    }

    static elementwise(matrix, x, func){
        return matrix.clone().elementwise(x, func);
    }


    static compareDimensions(a, b) {
        return a.rows === b.rows && a.cols === b.cols;
    }

    static isSquare(m) {
        return m.rows === m.cols;
    }

    static isLowerTriangular(m){
        if (!Matrix.isSquare(m)){
            return false;
        }

        for (let col = 0; col < this.cols; col++){
            for (let row = col + 1; row < this.rows; row++){
                if (m.get(row, col) !== 0){
                    return false;
                }
            }
        }

        return true;
    }

    static eye(n){
        const array = new Array(n).fill().map(() =>
            new Array(n).fill(0));

        for (let i = 0; i < n; i++){
            array[i][i] = 1;
        }

        return new Matrix(array);
    }

    static zeroes(m, n){
        const array = new Array(m).fill().map(() =>
            new Array(n).fill(0));

        return new Matrix(array);
    }

    static ones(m, n){
        const array = new Array(m).fill().map(() =>
            new Array(n).fill(1));

        return new Matrix(array);
    }

    static random(m, n){
        const array = new Array(m).fill().map(() =>
            new Array(n).fill().map(() => 1 - 2 * Math.random()));

        return new Matrix(array);
    }

    static add(a, b){
        return a.clone().add(b);
    }

    static sub(a, b){
        return a.clone().sub(b);
    }

    static multiply(a, b){
        return a.clone().multiply(b);
    }

    //Conversion
    static toIntegers(matrix){
        return Matrix.elementwise(matrix, Math.trunc);
    }

    //Activation Function
    static sigmoid(matrix){
        return Matrix.elementwise(matrix, sigmoid);
    }

    static sigmoid_prime(matrix){
        return Matrix.elementwise(matrix, x => sigmoid(x) * (1 - sigmoid(x)));
    }

    static relu(matrix){
        return Matrix.elementwise(matrix, x => Math.max(x, 0));
    }

    static tanh(matrix){
        return Matrix.elementwise(matrix, x => (Math.exp(x) + Math.exp(-x))/(Math.exp(x) - Math.exp(-x)));
    }

    //Strassen's algorithm
    static fastDot(a, b){
        const A = new Matrix
    }
}

const sigmoid = x => 1 / (1 + Math.exp(-x))