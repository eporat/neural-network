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

    get(row, column) {
        return this.data[row][column];
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
        if (typeof(x) === "number") {
            this.map(entry => func(entry, x));
        }

        if (x instanceof Matrix) {
            if (Matrix.compareDimensions(this, x)) {
                this.map((entry, i, j) => func(entry, x.get(i, j)));
            }
        }
    }

    //Arithmetic operations
    add(x) {
        this.elementwise(x, (a, b) => a + b);
    }

    multiply(x) {
        this.elementwise(x, (a, b) => a * b);
    }

    dot(m) {
        if (this.rows == m.cols){
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

    //Static functions
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

    static randomize(m, n){
        const array = new Array(m).fill().map(() =>
            new Array(n).fill().map(() => 1 - 2 * Math.random()));

        return new Matrix(array);
    }
}
