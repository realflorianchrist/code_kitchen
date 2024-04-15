import {GameObject} from "./game-object.js";

const canvas = document.getElementById('pong-game');
const context = canvas.getContext('2d');

export class Ball extends GameObject {
constructor(canvas, x, y, radius, dx, dy) {
        super(canvas, x, y, radius * 2, radius * 2);
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgb(23,255,0)';
        context.fill();
        context.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    bounceOfHorizontal() {
        this.dy = -this.dy;
    }

    bounceOfVertical() {
        this.dx = -this.dx;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
    }
}