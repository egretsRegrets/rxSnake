
import { checkCollision, getRandomPosition } from './canvas';
import { SNAKE_LENGTH, APPLE_COUNT } from './constants';

export function nextDirection(previous, next) {
    let isOpposite = (previous, next) => {
        return next.x === previous.x * -1 || next.y === previous.y * -1;
    };

    if (isOpposite(previous, next)){
        return previous;
    }

    return next;
}

export function move(snake, [direction, snakeLength]) {
    /**
     * snake is generated so that snake[0]
     * is, initially, the right-most (highest) x value
     */
    let nx = snake[0].x;
    let ny = snake[0].y;

    nx += 1 * direction.x;
    ny += 1 * direction.y;

    let tail;

    /**
     * if snakeLength has changed
     * assign new x, y vals to the var tail
     * place tail at the front of snake
     * if snakeLength has not changed,
     * remove the last element - tail - from the snake
     * modify the removed tail with latest direction vals
     * put it back on at the front of the snake
     */
    if (snakeLength > snake.length) {
        tail = {x: nx, y: ny};
    } else {
        tail = snake.pop();
        tail.x = nx;
        tail.y = ny;
    }

    snake.unshift(tail);

    return snake;
}

export function generateSnake() {
    let snake = [];

    for (let i = SNAKE_LENGTH - 1; i >= 0; i--){
        snake.push({x: i, y: 0});
    }

    return snake;
}

export function generateApples() {
    let apples = [];

    for (let i = 0; i < APPLE_COUNT; i++) {
        /**
         * note that getRandomPosition will have access to
         * snake, as the curr param to scan();
         * snake will be used inside getRandomPosition()
         * with isEmptyCell()
         */
        apples.push(getRandomPosition());
    }

    return apples;
}

export function eat(apples, snake) {
    let head = snake[0];

    /**
     * for every apple checkCollision w/ head
     * if collision, remove collision apple from apples,
     * return from eat with new array, spreading apples, adding new apple
     * if !checkCollision() then return apples
     */
    for (let i = 0; i < apples.length; i++){
        if (checkCollision(apples[i], head)) {
            apples.splice(i, 1);
            return [...apples, getRandomPosition(snake)];
        }
    }

    return apples;
}
