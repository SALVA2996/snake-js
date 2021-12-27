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

class Snake {
    oppositeDirections = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT',
    };

    constructor(startY, startX) {
        // Cell [ ...[row, col] ]
        this._pendingGrowth = 0;

        this._cells = new LinkedList();
        this._cells.push([startY, startX]);

        this._direction = 'UP'; // 'DOWN', 'LEFT', 'RIGHT', 'UP'
        
        this.trace = null; // Last deleted tail
    }

    head() {
        return this._cells.head.val;
    }

    tail() {
        return this._cells.tail.val;
    }

    grow() {
        this._pendingGrowth++;
    }

    changeDirection(direction) {
        if (this.oppositeDirections[this._direction] !== direction) {
            this._direction = direction;
        }
    }

    getNextCoordinates() {
        const newHead = [...this.head()];

        switch (this._direction) {
            case 'UP':
                newHead[0] += -1;
                break;
            case 'DOWN':
                newHead[0] += 1;
                break;
            case 'LEFT':
                newHead[1] += -1;
                break;
            case 'RIGHT':
                newHead[1] += 1;
                break;
        }

        return newHead;
    }

    move(options = { debug: false }) {
        const newHead = this.getNextCoordinates();

        // Shift the tail
        if (this._pendingGrowth <= 0) {
            this.trace = this._cells.shift();
        } else {
            this._pendingGrowth--;
        }

        this._cells.push(newHead);

        if (options.debug) {
            console.log(this._cells);
        }
    }
}

class Board {
    constructor(rows, cols) {
        this._debug = {
            fruits: {
                coordsArray: [],
                currentFruit: 0,
            },
        };

        this._gridSize = [rows, cols];
        this._grid = null;

        this.player = null;

        // Replaceable API
        this.renderFn = null;
        this.gameOverFn = null;

        this.resetBord();
    }

    spawnFruit() {
        if (this._debug?.fruits) {
            const { coordsArray, currentFruit } = this._debug.fruits;
            if (coordsArray.length && coordsArray.length > currentFruit) {
                const [fRow, fCol] = coordsArray[currentFruit];

                // Spawn if cell is empty
                if (this._grid[fRow][fCol] === 0) {
                    this._grid[fRow][fCol] = 2;
                }

                this._debug.fruits.currentFruit++;
                return;
            }
        }

        let y = 0;
        let x = 0;
        // Random spawn
        do {
            y = Math.floor(Math.random() * this._gridSize[0]);
            x = Math.floor(Math.random() * this._gridSize[1]);
        } while(this._grid[y][x] !== 0);

        this._grid[y][x] = 2;
    }

    snakeInsideBounds(coordinates) {
        return coordinates[0] >= 0 && coordinates[0] < this._gridSize[0]
            && coordinates[1] >= 0 && coordinates[1] < this._gridSize[1];
    }

    setSnake(val) {
        this.player = val;
    }

    setDebugFruits(coordsArray) {
        this._debug.fruits.coordsArray = coordsArray;
        this._debug.fruits.currentFruit = 0;

        this.spawnFruit();
    }

    resetBord() {
        this._grid = new Array(this._gridSize[0]).fill(0).map(() => {
            return new Array(this._gridSize[1]).fill(0);
        });
    }

    getMiddleCoordinates() {
        return [
            Math.floor(this._gridSize[0] / 2),
            Math.floor(this._gridSize[1] / 2),
        ];
    }

    updatePlayerInBoard() {
        const [nRow, nCol] = this.player.getNextCoordinates();
        // console.log(row, col);

        // Out of bounds GO
        if (!this.snakeInsideBounds([nRow, nCol])) {
            this.gameOverFn();
            return;
        }

        // Will eat
        switch (board._grid[nRow][nCol]) {
            case 2: // Will eat
                this.player.grow();
                this.spawnFruit();
                break;
            case 1: // Will die
                this.gameOverFn();
                return;
        }

        this.player.move();

        this._grid[nRow][nCol] = 1;

        // Delete last tail
        if (this.player.trace) {
            const [trRow, trCol] = this.player.trace;
            if (this._grid[trRow][trCol] === 1) {
                this._grid[trRow][trCol] = 0;
            }
        }
    }

    render() {
        if (!this.renderFn) return;

        this.renderFn(this._grid);
    }
}

