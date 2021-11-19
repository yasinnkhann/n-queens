// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

    */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var rowValue = this.get(rowIndex).reduce(function(prevNum, num) {
        return prevNum + num;
      });
      if (rowValue > 1) {
        return true;
      }
      return false; // Fixed
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var currentBoard = this.attributes;
      var loopCount = currentBoard.n - 1;
      for (let i = 0; i < loopCount; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // Fixed
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var currentBoard = this.attributes;
      var loopCount = currentBoard.n;
      var colValue = 0;
      for (let j = 0; j < loopCount; j++) {
        colValue += this.get(j)[colIndex];
      }
      if (colValue > 1) {
        return true;
      }
      return false; // fixed
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var currentBoard = this.attributes;
      var loopCount = currentBoard.n - 1;
      for (let i = 0; i < loopCount; i++) {
        // i is column Index
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // Fixed
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var result = 0;
      var row = 0;

      while (majorDiagonalColumnIndexAtFirstRow < 0) {
        majorDiagonalColumnIndexAtFirstRow++;
        row++;
      }

      while (this._isInBounds(row, majorDiagonalColumnIndexAtFirstRow)) {
        if (this.get(row)[majorDiagonalColumnIndexAtFirstRow] === 1) {
          result++;
        }
        majorDiagonalColumnIndexAtFirstRow++;
        row++;
      }

      if (result > 1) {
        return true;
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var i = 0; i < this.attributes.n - 1; i++) {
        for (var j = 0; j < this.attributes.n - 1; j++) {
          var index = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          if (this.hasMajorDiagonalConflictAt(index)) {
            return true;
          }
        }
      }
      return false; // Fixed
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var result = 0;
      var row = 0;

      while (minorDiagonalColumnIndexAtFirstRow > this.attributes.n - 1) {
        minorDiagonalColumnIndexAtFirstRow--;
        row++;
      }
      while (this._isInBounds(row, minorDiagonalColumnIndexAtFirstRow)) {
        if (this.get(row)[minorDiagonalColumnIndexAtFirstRow] === 1) {
          result++;
        }
        minorDiagonalColumnIndexAtFirstRow--;
        row++;
      }

      return result >= 2 ? true : false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var length = this.attributes.n;
      for (var i = 0; i < length - 1; i++) {
        for (var j = length - 1; j > 0; j--) {
          var index = this._getFirstRowColumnIndexForMinorDiagonalOn(i, j);
          if (this.hasMinorDiagonalConflictAt(index)) {
            return true;
          }
        }
      }
      return false; // Fixed
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
