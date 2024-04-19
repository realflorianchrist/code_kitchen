import {GameObject} from "./game-object.js";

export class Player extends GameObject {
    constructor(canvas, x, y, height, width, score, speed) {
        super(canvas, x, y, height, width);
        this.score = score;
        this.speed = speed;
    }

    draw(context) {
        context.fillStyle = 'rgb(23,255,0)';
        context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    moveUp() {
        if (this.y - this.height / 2 > 0) {
            this.move(0, -this.speed);
        }
    }

    moveDown() {
        if (this.y + this.height / 2 < this.canvas.height) {
            this.move(0, this.speed);
        }
    }

    increaseScore() {
        this.score++;
    }

    resetScore() {
        this.score = 0;
    }
}