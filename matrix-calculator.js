class MatrixCalculator {

    static rowEchelonForm(matrix, operations=undefined){
        const tempMatrix = matrix.clone();

        for (let col = 0; col < tempMatrix.cols; col++){
            let row = 0;
            for (row = col ; row < tempMatrix.rows; row++){
                if (tempMatrix.get(row, col) !== 0){
                    break;
                }
            }

            if (row == tempMatrix.rows){
                return false;
            }

            if (col !== row){
                if (operations !== undefined){
                    operations.push(new RowOperation("swap", col, row));
                }

                tempMatrix.swap(col, row);
            }

            if (operations !== undefined){
                operations.push(new RowOperation("mult", col,
                1 / tempMatrix.get(col, col)));
            }

            tempMatrix.multiplyRow(col, 1 / tempMatrix.get(col, col));

            for (let nextRow = col + 1; nextRow < tempMatrix.rows; nextRow++){
                if (operations !== undefined){
                    operations.push(new RowOperation("addOther", nextRow, col,
                    - tempMatrix.get(nextRow, col) / tempMatrix.get(col, col)));
                }

                tempMatrix.addMultiplyOfRow(
                    nextRow, col,
                    - tempMatrix.get(nextRow, col) / tempMatrix.get(col, col));
            }

        }
        return tempMatrix;
    }

    static canonicalForm(matrix, operations=undefined){
        const tempMatrix = MatrixCalculator.rowEchelonForm(matrix, operations);

        for (let col = tempMatrix.cols - 1; col >=0 ; col --){
            for (let nextRow = col - 1; nextRow >= 0; nextRow --){
                if (operations !== undefined){
                    operations.push(new RowOperation("addOther", nextRow, col,
                    - tempMatrix.get(nextRow, col) / tempMatrix.get(col, col)));
                }

                tempMatrix.addMultiplyOfRow(
                    nextRow, col,
                    - tempMatrix.get(nextRow, col) / tempMatrix.get(col, col));
            }
        }

        return tempMatrix;
    }

    static inverseMatrix(matrix){
        if (!Matrix.isSquare(matrix)){
            return;
        }

        const operations = [];
        const rowEchelonMatrix = MatrixCalculator.canonicalForm(matrix, operations);

        if (rowEchelonMatrix){
            if (Matrix.isLowerTriangular(rowEchelonMatrix)){
                const tempMatrix = Matrix.eye(matrix.rows);

                operations.forEach((operation) => {
                    RowOperation.applyOperation(tempMatrix, operation);
                });

                return tempMatrix;
            }
        }

        return undefined;
    }

    static determinant(matrix) {

        function standardDeterminant(matrix){
            if (Matrix.isSquare(matrix)) {
                if (matrix.rows === 1) {
                    return matrix.get(0, 0);
                }
        
                return matrix.data[0].reduce((prev, row, j) => {
                    return prev + Math.pow(-1, j) *
                        matrix.get(j, 0) *
                        matrix.minor(j, 0).determinant();
                }, 0);
            }
        }

        function rowEchelonDeterminant(matrix){
            const operations = [];
            const rowEchelonMatrix = MatrixCalculator.
                                        rowEchelonForm(matrix, operations);
            if (rowEchelonMatrix){
                let determinant = 1;
                operations.forEach((operation) => {
                    if (operation.type === "mult"){
                        determinant /= operation.num;
                    } else if (operation.type == "swap"){
                        determinant *= -1;
                    }
                });

                return determinant;
            }

            return 0;
        }

        return rowEchelonDeterminant(matrix);
    }
}
