// let m = new Matrix(3,2);


class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  // converts matrix A to A^-1 via Gauss-Jordan elimination
  invert() {
    // Check for squareness
    if (this.rows !== this.cols) {
      console.log('Cannot invert a non-square matrix.');
      return;
    }

    // Append indentity matrix
    // x, x, x, 1, 0, 0
    // x, x, x, 0, 1, 0
    // x, x, x, 0, 0, 1
    this.cols *= 2;
    for (let a = 0; a < this.rows; a++) {
      this.data[a] = this.data[a].concat(this.data[a].map((x, i) => i === a ? 1 : 0));
    }

    // Perform Guassian elimination
    // Reduce rows to reduced row echelon form
    // 1, 0, 0, y, y, y
    // 0, 1, 0, y, y, y
    // 0, 0, 1, y, y, y
    let pivotRow = 0;
    let pivotCol = 0;
    while (pivotRow < this.rows && pivotCol < this.cols) {
      // If our pivot is 0, swap out or move to next column
      if (this.data[pivotRow][pivotCol] === 0) {
        let swapped = false;
        for (let i = pivotRow + 1; i < this.rows; i++) {
          if (Math.abs(this.data[i][pivotCol]) > 0) {
            const temp = this.data[row1].slice();
            this.data[row1] = this.data[row2].slice();
            this.data[row2] = temp;
            swapped = true;
            break;
          }
        }
        // All zeros to the bottom
        if (!swapped) {
          pivotCol += 1;
          continue;
        }
      }

      // Multiply whole row so pivot is 1
      const f = this.data[pivotRow][pivotCol];
      this.data[pivotRow] = this.data[pivotRow].map(c => c / f);

      // Reduce other items in pivot column to 0
      for (let i = 0; i < this.rows; i++) {
        if (i === pivotRow) {
          continue;
        }
        const p = this.data[i][pivotCol];
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] -= this.data[pivotRow][j] * p;
        }
      }
      pivotRow += 1;
      pivotCol += 1;
    }

    // Slice away left half of the array
    // 1, 0, 0, (y, y, y)
    // 0, 1, 0, (y, y, y)
    // 0, 0, 1, (y, y, y)
    this.cols /= 2;
    this.data = this.data.map(r => r.slice(this.cols));
    return this;
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}
