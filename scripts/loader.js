// ============ Board and game initialization =========

const board = new Board(10, 30);
const demoMovementLimit = -1;
let movements = 0;
let boardInterval = null;

board.setSnake(
    new Snake(board.getMiddleCoordinates()[0], board.getMiddleCoordinates()[1]),
);

// DEBUGGER
board.setDebugFruits([
    [board.getMiddleCoordinates()[0] - 1, board.getMiddleCoordinates()[1]],
    [board.getMiddleCoordinates()[0] - 2, board.getMiddleCoordinates()[1]],
    [board.getMiddleCoordinates()[0] - 3, board.getMiddleCoordinates()[1]],
    [board.getMiddleCoordinates()[0] - 4, board.getMiddleCoordinates()[1]],
]);

// ================

function startGame() {
    boardInterval = setInterval(() => {
        movements += 1;

        if (demoMovementLimit > -1 && movements >= demoMovementLimit) {
            clearInterval(boardInterval);
        }
        board.updatePlayerInBoard();
        board.render();
    }, 500);
}

function mountBoard() {
    board.gameOverFn = () => {
        clearInterval(boardInterval);
        alert('Game Over');
    }

    board.renderFn = (grid) => {
        const boardEl = document.getElementById('game-board');
        boardEl.innerHTML = '';

        if (boardEl) {
            const rows = [];
    
            for (let i = 0; i < grid.length; i++) {
                rows.push(document.createElement('tr'));

                for (let j = 0; j < grid[i].length; j++) {
                    rows[i].appendChild(
                        document.createElement('td')
                    );

                    rows[i].childNodes[j].className = 'c' + grid[i][j].toString();
                    // rows[i].childNodes[j].textContent = grid[i][j];
                }
            }
            // boardEl.innerHTML = 'Hello';
            boardEl.append(...rows);
        }
    }

    startGame();
}

window.onkeydown = (event) => {
    const { key } = event;

    const directionDictionary = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT',
    }

    board.player.changeDirection(directionDictionary[key]);

    console.log(event.key, key);
}

window.onload = () => {
    mountBoard();
    console.log('Board mounted...');
};
