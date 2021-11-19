/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

// hasAnyQueenConflictsOn: function(rowIndex, colIndex)
// hasAnyRooksConflicts: function()
// togglePiece: function(rowIndex, colIndex)

window.findNRooksSolution = function(n) {
  var solution = new Board({n: n}); //fixme
  var length = solution.attributes.n;

  var checkConflict = function(rowIndex, colIndex) { // checkConflict(0, 0);
    solution.togglePiece(rowIndex, colIndex);
    // Base case
    // check if there are conflict
    if (solution.hasAnyRooksConflicts()) {
      // un-toggle piece
      solution.togglePiece(rowIndex, colIndex);
    }
    if (solution._isInBounds(rowIndex += 1, colIndex += 1)) {
      checkConflict(rowIndex, colIndex);
    } else {
      return;
    }
  };

  checkConflict(0, 0);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // var solutionCount = 0;
  // var board = new Board({n: n});

  // var findSolution = function(row) {
  //   if (row === n) {
  //     solutionCount++;
  //     return;
  //   }

  //   for (var i = 0; i < n; i++) {
  //     board.togglePiece(row, i);
  //     if (!board.hasAnyRooksConflicts()) {
  //       findSolution(row + 1);
  //     }
  //     board.togglePiece(row, i);
  //   }
  // };

  // findSolution(0);

  // console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  // return solutionCount;

  if (n === 0) {
    return 1;
  }
  return n * countNRooksSolutions(n - 1); // n * (n-1)!
};

console.log('N ROOK SOLUTIONS: ', countNRooksSolutions(4)); // 24

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = new Board({n: n});
  var length = solution.attributes.n;

  var checkConflict = function(pieceCount) {
    var row = pieceCount;

    if (pieceCount === n) {
      return true;
    }
    for (var i = 0; i < length; i++) {
      // toggle piece
      solution.togglePiece(row, i);
      pieceCount += 1;

      if (!solution.hasAnyQueenConflictsOn(row, i)) {
        if (checkConflict(pieceCount)) {
          return true;
        }
      }
      // untoggle piece
      solution.togglePiece(row, i);
      pieceCount -= 1;
    }
  };

  checkConflict(0);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution.rows();
};

console.log('N QUEENS SOLUTION: ', findNQueensSolution(4)); // 2

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});

  var findSolution = function(row) {
    if (row === n) {
      solutionCount++;
      return;
    }

    for (var i = 0; i < n; i++) {
      board.togglePiece(row, i);
      if (!board.hasAnyQueensConflicts()) {
        findSolution(row + 1);
      }
      board.togglePiece(row, i);
    }
  };

  findSolution(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
