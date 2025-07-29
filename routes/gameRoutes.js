/**
 * @file gameRoutes.js
 * @description Express routes for Four-in-a-Row game logic.
 */

const express = require('express');
const router = express.Router();

/**
 * Returns a fresh game state object.
 * @returns {Object} New game state.
 */
const initialState = () => ({
    board: Array(16).fill(""),
    gameState: 'flip',
    currentPlayer: null,
    startingPlayer: null,
    player: null,
    comp: null,
    disable: false,
    winnerCombo: null
});

let game = initialState();

/**
 * List of all winning combinations (rows, columns, diagonals).
 * @type {number[][]}
 */
const winningCombos = [
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9,10,11], [12,13,14,15],
    [0, 4, 8,12], [1, 5, 9,13], [2, 6,10,14], [3, 7,11,15],
    [0, 5,10,15], [3, 6, 9,12]
];

/**
 * Checks for a win by the given player.
 * @param {string[]} board - The current game board.
 * @param {string} player - Player symbol ('X' or 'O').
 * @returns {number[]|null} Winning combination or null if none.
 */
function checkWin(board, player) {
    return winningCombos.find(combo => combo.every(i => board[i] === player)) || null;
}

/**
 * GET /api/state  
 * Returns the current game state.
 */
router.get('/state', (req, res) => {
    res.json(game);
});

/**
 * POST /api/reset  
 * Resets the game to initial state.
 */
router.post('/reset', (req, res) => {
    game = {
        ...initialState(),
        gameState: 'flip',
        startingPlayer: null,
        player: null,
        comp: null,
        currentPlayer: null
    };
    res.json(game);
});

/**
 * POST /api/flip  
 * Flips a coin to decide starting player and initializes a new game.
 */
router.post('/flip', (req, res) => {
    const coin = Math.random() < 0.5 ? 'O' : 'X';
    game = {
        ...initialState(),
        startingPlayer: coin,
        player: 'O',
        comp: 'X',
        currentPlayer: coin,
        gameState: 'start'
    };
    res.json(game);
});

/**
 * POST /api/move  
 * Handles a move by the current player.
 * @param {Object} req.body
 * @param {number} req.body.index - The index of the move.
 */
router.post('/move', (req, res) => {
    const { index } = req.body;

    if (game.disable || game.board[index] !== "") {
        return res.json(game);
    }

    const current = game.currentPlayer;
    game.board[index] = current;

    const winCombo = checkWin(game.board, current);
    if (winCombo) {
        game.disable = true;
        game.winnerCombo = winCombo;
        game.gameState = 'start';
    } else if (!game.board.includes("")) {
        game.disable = true;
        game.gameState = 'start'; // Draw
    } else {
        game.currentPlayer = current === game.player ? game.comp : game.player;
    }

    res.json(game);
});

module.exports = router;
