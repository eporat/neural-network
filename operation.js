class RowOperation {
    constructor(){
        const type = arguments[0];

        if (type === "swap"){
            this.type = "swap";
            this.rowA = arguments[1];
            this.rowB = arguments[2];
        }

        if (type === "mult"){
            this.type = "mult";
            this.rowA = arguments[1];
            this.num = arguments[2];
        }

        if (type === "addOther"){
            this.type = "addOther";
            this.rowA = arguments[1];
            this.rowB = arguments[2];
            this.num = arguments[3];
        }
    }

    static applyOperation(matrix, operation){
        //console.log(operation);
        if (operation.type === "swap"){
            matrix.swap(operation.rowA, operation.rowB);
        }

        if (operation.type === "mult"){
            matrix.multiplyRow(operation.rowA, operation.num);
        }

        if (operation.type === "addOther"){
            matrix.addMultiplyOfRow(operation.rowA, operation.rowB, operation.num);
        }
    }

    static inverseOperation(operation){
        if (operation.type === "swap"){
            return new RowOperation("swap", operation.rowB, operation.rowA);
        }

        if (operation.type === "mult"){
            return new RowOperation("mult", operation.rowA, 1/operation.num);
        }

        if (operation.type === "addOther"){
            return new RowOperation("addOther",
            operation.rowA, operation.rowB, -operation.num);
        }
    }
}
