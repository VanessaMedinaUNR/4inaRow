/**
 * @file gameLogic.js
 * @author Vanessa Medina
 * @date 07/29/25
 * @description Pure game logic functions for a 4x4 Tic-Tac-Toe board.
 */

/**
 * Checks whether the specified player has a winning combination.
 * @param {string[]} board - An array of 16 cells with values 'X', 'O', or ''.
 * @param {string} player - The player symbol to check ('X' or 'O').
 * @returns {number[]|null} Array of winning cell indices if found, otherwise null.
 */
function checkWin(board, player) {
    const wins = [
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9,10,11], [12,13,14,15],  // Rows
        [0, 4, 8,12], [1, 5, 9,13], [2, 6,10,14], [3, 7,11,15],  // Columns
        [0, 5,10,15], [3, 6, 9,12]                              // Diagonals
    ];
    for (const combo of wins) {
        if (combo.every(i => board[i] === player)) {
            return combo;
        }
    }
    return null;
}

/**
 * Returns the index of the next available move.
 * @param {string[]} board - The current game board.
 * @param {string} player - The player making the move ('X' or 'O').
 * @returns {number|null} Index of the next move, or null if no moves available.
 */
function nextMove(board, player) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            return i;
        }
    }
    return null;
}

export { checkWin, nextMove };
