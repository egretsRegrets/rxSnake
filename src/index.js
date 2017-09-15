import { Observable, BehaviorSubject } from 'rxjs'

import { createCanvasElement } from './canvas';
import { DIRECTIONS, KEYS } from './interfaces'
import { nextDirection, move, generateSnake, eat, generateApples } from './utils';
import { SNAKE_LENGTH, POINTS_PER_APPLE, SPEED} from './constants';

/**
 * Starting vals:
 */
const INITIAL_DIRECTION = DIRECTIONS[KEYS.RIGHT];

/**
 * creating, appending canvas:
 */
let canvas = createCanvasElement();
// establish the CanvasRenderingContext2D
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

/**
 * Source Streams
 * keydown$ - user keypresses
 * snakeLength$ - length of snake
 * ticks$ - pace of snake
 */
let keydown$ = Observable.fromEvent(document, 'keydown');
// emit tick at interval of speed
let ticks$ = Observable.interval(SPEED);
/**
 * BehaviorSubject is a Subject, which implements both the observable
 * and observer types; BheaviorSubjects require an initial value.
 * So it works in our case where we have an arbitrary starting value
 */

let length$ = new BehaviorSubject(SNAKE_LENGTH);
let snakeLength$ = length$
    .scan((step, snakeLength) => snakeLength + step)
    // we use share() to multicast - allowing us to share this
    // observable with other subscribers without re-starting the subject again
    .share();


let direction$ = keydown$
    .map(event => DIRECTIONS[event.keyCode])
    // filter only for not-falsey returns
    .filter(direction => !!direction)
    .scan(nextDirection)
    .startWith(INITIAL_DIRECTION)
    // we only emit when it looks like next here is not equal to previous
    .distinctUntilChanged();

let score$ = snakeLength$
    // snakeLength emission is used to notify subscribers
    .startWith(0)
    .scan((score, _) => score + POINTS_PER_APPLE);


let snake$ = ticks$
    // we use withLatest to throttle directions, we only care about values on ticks$
    .withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength) => [direction, snakeLength])
    .scan(move, generateSnake())
    .share();

let apples$ = snake$
    .scan(eat, generateApples())
    .distinctUntilChanged()
    .share();
