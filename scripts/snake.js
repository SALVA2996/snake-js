class LinkedListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    push(val) {
        const newNode = new LinkedListNode(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = this.head;
            return;
        }
        this.head.next = newNode;
        this.head = newNode;
    }

    shift() {
        if (!this.tail) return;

        const prevTail = this.tail;

        if (this.tail === this.head) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.next;
            prevTail.next = null;
        }

        return prevTail.val;
    }
}

// ======================
const DirectionsEnum = Object.freeze({
    'UP': 1,
    'DOWN': 2,
    'LEFT': 3,
    'RIGHT': 4,
});

const oppositeDirections = Object.freeze({
    [DirectionsEnum.UP]: DirectionsEnum.DOWN,
    [DirectionsEnum.DOWN]: DirectionsEnum.UP,
    [DirectionsEnum.LEFT]: DirectionsEnum.RIGHT,
    [DirectionsEnum.RIGHT]: DirectionsEnum.LEFT,
});
// ======================
class Snake {
    _nextDirection = 0;
    _currentDirection = DirectionsEnum.UP;
    _pendingGrowth = 0;

    _cells = null;

    trace = null;

    constructor(startY, startX) {
        this._pendingGrowth = 0;

        this._cells = new LinkedList();
        this._cells.push([startY, startX]);

        this._currentDirection = DirectionsEnum.UP;
        
        this.trace = null;
    }

    get _head() {
        return this._cells.head.val;
    }

    get nextCoordinates() {
        const newHead = [...this._head];

        switch (this._currentDirection) {
            case DirectionsEnum.UP:
                newHead[0] += -1;
                break;
            case DirectionsEnum.DOWN:
                newHead[0] += 1;
                break;
            case DirectionsEnum.LEFT:
                newHead[1] += -1;
                break;
            case DirectionsEnum.RIGHT:
                newHead[1] += 1;
                break;
        }

        return newHead;
    }

    willEatFruit() {
        this._pendingGrowth++;
    }

    queueDirection(nextDirection) {
        if (oppositeDirections[this._currentDirection] !== nextDirection) {
            this._nextDirection = nextDirection;
        }
    }

    updateDirection() {
        if (this._nextDirection) {
            this._currentDirection = this._nextDirection;
            this._nextDirection = 0;
        }
    }

    moveInCurrentDirection(options = { debug: false }) {
        const nextPosition = this.nextCoordinates;

        // Shift the tail
        if (this._pendingGrowth <= 0) {
            this.trace = this._cells.shift();
        } else {
            this._pendingGrowth--;
        }

        this._cells.push(nextPosition);

        if (options.debug) {
            console.log(this._cells);
        }
    }
}

class Board {
    _renderFn = null;
    _gameOverFn = null;
    
    constructor(rows, cols) {
        this._gridSize = [rows, cols];
        this._grid = null;
    }

    get _middleCoordinates() {
        return [
            Math.floor(this._gridSize[0] / 2),
            Math.floor(this._gridSize[1] / 2),
        ];
    }

    _spawnFruit() {
        let y = 0;
        let x = 0;
        // Random spawn
        do {
            y = Math.floor(Math.random() * this._gridSize[0]);
            x = Math.floor(Math.random() * this._gridSize[1]);
        } while(this._grid[y][x] !== 0);

        this._grid[y][x] = 2;
    }

    _isSnakeInsideBounds(coordinates) {
        return coordinates[0] >= 0 && coordinates[0] < this._gridSize[0]
            && coordinates[1] >= 0 && coordinates[1] < this._gridSize[1];
    }

    _updateSnakeInBoard() {
        this.player.updateDirection();

        const [nRow, nCol] = this.player.nextCoordinates;

        // Out of bounds GO
        if (!this._isSnakeInsideBounds([nRow, nCol])) {
            this._gameOverFn();
            return;
        }

        // Will eat
        switch (board._grid[nRow][nCol]) {
            case 2: // Will eat
                this.player.willEatFruit();
                this._spawnFruit();
                break;
            case 1: // Will die
                this._gameOverFn();
                return;
        }

        this.player.moveInCurrentDirection();

        this._grid[nRow][nCol] = 1;

        // Delete last tail
        if (this.player.trace) {
            const [trRow, trCol] = this.player.trace;
            if (this._grid[trRow][trCol] === 1) {
                this._grid[trRow][trCol] = 0;
            }
        }
    }

    _render() {
        if (!this._renderFn) return;

        this._renderFn(this._grid);
    }

    setUp(renderFn, gameOverFn) {
        this._gameOverFn = gameOverFn;
        this._renderFn = renderFn;
    }
    
    reset() {
        this.player = new Snake(this._middleCoordinates[0], this._middleCoordinates[1]);
        
        this._grid = new Array(this._gridSize[0]).fill(0).map(() => {
            return new Array(this._gridSize[1]).fill(0);
        });

        this._spawnFruit();
    }

    flick() {
        this._updateSnakeInBoard();
        this._render();
    }
}

