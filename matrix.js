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
        let multipliedData = new Array(this.rows)
            .fill()
            .map(() => new Array(m.cols).fill(0));

        multipliedData = multipliedData.map((row, i) => {
            return row.map((col, j) => {
                return this.data[i].reduce((prev, entry, idx) => {
                    return prev + entry * m.get(idx, j);
                });
            });
        });

        return new Matrix(multipliedData);
    }

    //Special operations
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

    minor(i, j) {
        return new Matrix(
            this.data.slice(0, i).concat(this.data.slice(i + 1))
                .map(row => row.slice(0, j).concat(row.slice(j + 1)))
        );
    }

    determinant() {
        if (Matrix.isSquare(this)) {
            if (this.rows === 1) {
                return this.get(0, 0);
            }

            return this.data[0].reduce((prev, row, j) => {
                return prev + Math.pow(-1, j) *
                    this.get(j, 0) *
                    this.minor(j, 0).determinant();
            }, 0);
        }
    }

    //Cloning
    clone() {
        return new Matrix(this.data.clone());
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
}
