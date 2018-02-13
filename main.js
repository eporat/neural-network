const N = 10;
const array = new Array(N).fill().map(() => new Array(N).fill(0));

for (let i = 0; i < N; i++){
  array[i][i] = 2;
}

const matrix = new Matrix(array);
console.log(matrix.determinant());
