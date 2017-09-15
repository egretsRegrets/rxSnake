import { Observable, BehaviorSubject, animationFrame } from './rxjs'

import { createCanvasElement, renderScene, renderGameOver } from './canvas';
import { DIRECTIONS, KEYS } from './interfaces'
import { nextDirection, move, generateSnake, eat, generateApples, isGameOver } from './utils';
import { SNAKE_LENGTH, POINTS_PER_APPLE, SPEED, FPS} from './constants';

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

let direction$ = keydown$
.map(event => DIRECTIONS[event.keyCode])
// filter only for not-falsey returns
.filter(direction => !!direction)
.scan(nextDirection)
.startWith(INITIAL_DIRECTION)
// we only emit when it looks like next here is not equal to previous
.distinctUntilChanged();

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

let score$ = snakeLength$
    // snakeLength emission is used to notify subscribers
    .startWith(0)
    .scan((score, _) => score + POINTS_PER_APPLE);


let snake$ = ticks$
    // we use withLatest to throttle directions, we only care about values on ticks$
    .withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength) => [direction, snakeLength])
    // the result of generateSnake() is a seed value - 'snake'
    .scan(move, generateSnake())
    .share();

let apples$ = snake$
    .scan(eat, generateApples())
    // apples will come in with every tick, but only broadcast when changed
    .distinctUntilChanged()
    .share();

let applesEaten$ = apples$
    // skip the first emission, when apples are generated
    .skip(1)
    // give length$ it's next input, equal to POINT_PER_APPLE
    .do(() => length$.next(POINTS_PER_APPLE))
    // no other Observable is subscribing to this stream, so we do it manually
    .subscribe();


/**
 * We need to combine our streams into one stream representing
 * the whole scene to draw.
 * We can think, 'what are the streams we need to surface as game elements?' :
 * snake$, score$, apples$
 */

let scene$ = Observable
    // we want to produce an object representing game state
    .combineLatest(
        snake$, apples$, score$,
        (snake, apples, score) => ({snake, apples, score})
    );

// rendering the scene:

/**
 * interval() expects a val in ms, so we convert
 * a val representing 60 instances per second,
 * to it's occurrence per ms
 */

/**
 * interval excepts a schedular param
 * animationFrame schedules to the call window.requestAnimationFrame
 */
let game$ = Observable
    .interval(1000 / FPS, animationFrame)
    .withLatestFrom(scene$, (_, scene) => scene)
    .takeUntil(!isGameOver(scene))
    .subscribe({
        next: (scene) => renderScene(ctx, scene),
        complete: () => renderGameOver(ctx)
    });


