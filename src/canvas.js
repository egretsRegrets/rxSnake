
export const COLS = 30;
export const ROWS = 30;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

export function createCanvasElement() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas;
}

export function checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
}

export function getRandomPosition(snake = []) {
    let position = {
        x: getRandomNumber(0, COLS - 1),
        y: getRandomNumber(0, ROWS - 1)
    };

    if (isEmptyCell(position, snake)) {
        return position;
    }

    // re-roll if !isEmptyCell
    return getRandomPosition(snake);
}

export function renderScene() {}

export function renderGameOver() {}

function isEmptyCell(position, snake) {
    return !snake.some(segment => checkCollision(segment, position));
}

function getRandomNumber(min, max) {
    // keep in ming Math.random() returns from 0 - 1, excl 0, excl 1
    return Math.floor(Math.random() * (max - min + 1) + min);
}