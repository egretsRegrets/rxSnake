
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

export function renderScene(ctx, scene) {
    renderBackground(ctx);
    renderScore(ctx, scene.score);
    renderApples(ctx, scene.apples);
    renderSnake(ctx, scene.snake);
}

export function renderGameOver(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let textX = CANVAS_WIDTH / 2;
    let textY = CANVAS_HEIGHT / 2;

    drawText(ctx, 'GAME OVER!', textX, textY, 'black', 25);
}

// non-export rendering functions

function renderBackground(ctx) {
    // canvas background color
    ctx.fillStyle = '#EEE';
    // draw rectangle
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderScore(ctx, score) {
    let textX = CANVAS_WIDTH / 2;
    let textY = CANVAS_HEIGHT / 2;

    drawText(
        ctx,
        score.toString(),
        textX,
        textY,
        'rgba(0,0,0,.2)',
        150
    );
}

function renderApples(ctx, apples) {
    apples.forEach(apple => paintCell(
        ctx, apple, 'red'
    ));
}

function renderSnake(ctx, snake) {
    snake.forEach((segment, index) => paintCell(
        ctx,
        wrapBounds(segment),
        getSegmentColor(index)
    ));
}

function drawText(
    ctx,
    text,
    x,
    y,
    fillStyle,
    fontSize,
    horizontalAlign = 'center',
    verticalAlign = 'middle'
) {
    ctx.fillStyle = fillStyle;
    ctx.font = `bold ${fontSize}px sans-serif`;

    let textX = x;
    let textY = y;

    ctx.textAlign = horizontalAlign;
    ctx.textBaseline = verticalAlign;

    ctx.fillText(text, textX, textY);
}

function getSegmentColor(index) {
    return index === 0 ? 'black' : '#2196f3';
}

function paintCell(ctx, point, color) {
    const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
    const y = point.y * CELL_SIZE + (point.y * GAP_SIZE);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}

function wrapBounds(point) {
    point.x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
    point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

    return point;
}

function isEmptyCell(position, snake) {
    return !snake.some(segment => checkCollision(segment, position));
}

function getRandomNumber(min, max) {
    // keep in ming Math.random() returns from 0 - 1, excl 0, excl 1
    return Math.floor(Math.random() * (max - min + 1) + min);
}