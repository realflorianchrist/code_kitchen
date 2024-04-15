import {GameObject} from "./game-object.js";

export class Ball extends GameObject {
constructor(x, y, radius, dx, dy) {
        super(x, y, radius * 2, radius * 2);
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgb(17,178,0)';
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
}