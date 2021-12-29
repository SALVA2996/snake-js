// ============ Board and game initialization =========

const board = new Board(10, 30);

// ================

let flickInterval = null;

const gameOverFn = () => {
    clearInterval(flickInterval);
    alert('Game Over');
};

const renderFn = (grid) => {
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
};

const startGame = () => {
    if (flickInterval) {
        clearInterval(flickInterval);
    }
    board.reset();

    flickInterval = setInterval(() => {
        board.flick();
    }, 200);
}

window.onkeydown = (event) => {
    const { key } = event;

    const directionDictionary = {
        'ArrowUp': DirectionsEnum.UP,
        'ArrowDown': DirectionsEnum.DOWN,
        'ArrowLeft': DirectionsEnum.LEFT,
        'ArrowRight': DirectionsEnum.RIGHT,
    }

    board.player.queueDirection(directionDictionary[key]);
}

window.onload = () => {
    board.setUp(renderFn, gameOverFn);
    startGame();
    console.log('Board mounted...');
};
