import { Observable } from 'rxjs'

import { createCanvasElement } from './canvas';
import { DIRECTIONS, KEYS } from './interfaces'
import { nextDirection } from './utils';

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
 * Source Stream - Keydown
 */
let keydown$ = Observable.fromEvent(document, 'keydown');

let direction$ = keydown$
    .map(event => DIRECTIONS[event.keyCode])
    // filter only for not-falsey returns
    .filter(direction => !!direction)
    .scan(nextDirection)
    .startWith(INITIAL_DIRECTION)
    .distinctUntilChanged();
