import { createCanvasElement} from './canvas';

let canvas = createCanvasElement();
// establish the CanvasRenderingContext2D
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);