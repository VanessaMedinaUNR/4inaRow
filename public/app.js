/**
 * @file app.js
 * @author Vanessa Medina
 * @date 07/29/25
 * @description Client-side logic for the 4x4 game.
 */

import { checkWin, nextMove } from './gameLogic.js';

let state = {};

/**
 * Updates the Flip/Clear/Start button label based on game state.
 */
function updateButtonText() {
    const btn = document.getElementById('startClearbtn');
    if (state.gameState === 'flip') btn.textContent = 'Flip';
    else if (state.gameState === 'clear' || (state.gameState === 'start' && state.disable)) btn.textContent = 'Clear';
    else btn.textContent = 'Start';
}

/**
 * Updates the game board UI to reflect the current board state.
 * Colors winning combination in red if applicable.
 */
function updateCell() {
    state.board.forEach((val, i) => {
        const cell = document.getElementById(`cell-${i}`);
        cell.textContent = val;
        cell.style.color = state.winnerCombo?.includes(i) ? 'red' : 'black';
    });
}

/**
 * Sends a request to the server to flip a virtual coin and set the starting player.
 */
async function flipCoin() {
    const res = await fetch('/api/flip', { method: 'POST' });
    state = await res.json();
    alert(`Coin flipped! ${state.startingPlayer} starts.`);
    updateCell();
    updateButtonText();
}

/**
 * Determines and submits the computer’s next move.
 */
async function compMove() {
    const move = nextMove(state.board, state.comp);
    if (move === null) return;

    const res = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: move })
    });

    state = await res.json();
    updateCell();
    updateButtonText();
}

/**
 * Handles the player's move by submitting it to the server.
 * @param {number} index - The cell index clicked by the player.
 */
async function cellClick(index) {
    if (state.disable || state.board[index] !== "" || state.currentPlayer !== state.player) return;

    const res = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
    });

    state = await res.json();
    updateCell();
    updateButtonText();

    if (!state.disable && state.currentPlayer === state.comp) {
        setTimeout(compMove, 500);
    }
}

/**
 * Handles Flip, Start, or Clear button presses depending on game state.
 */
async function btnPressed() {
    if (state.gameState === 'flip') {
        await flipCoin();
    } else if (state.gameState === 'start' && !state.disable) {
        if (state.currentPlayer === state.comp) {
            await compMove();
        }
    } else if (state.gameState === 'start' && state.disable) {
        const res = await fetch('/api/reset', { method: 'POST' });
        state = await res.json();
        updateCell();
        updateButtonText();

        if (!state.disable && state.currentPlayer === state.comp) {
            setTimeout(compMove, 500);
        }
    } else if (!state.disable) {
        alert("You can't clear mid-game.");
    }
}

/**
 * Fetches the initial game state from the server when the page loads.
 */
async function loadState() {
    const res = await fetch('/api/state');
    state = await res.json();
    console.log("Initial state loaded:", state);
    updateCell();
    updateButtonText();

    if (!state.disable && state.currentPlayer === state.comp) {
        setTimeout(compMove, 500);
    }
}

document.getElementById("startClearbtn").addEventListener("click", btnPressed);
for (let i = 0; i < 16; i++) {
    document.getElementById(`cell-${i}`).addEventListener("click", () => cellClick(i));
}
loadState();
