import {GameObject} from "./game-object.js";

export class Player extends GameObject {
    constructor(x, y, height, width, score) {
        super(x, y, height, width);
        this.score = score;
    }

    draw(context) {
        context.fillStyle = 'rgb(17,178,0)';
        context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    moveUp() {
        if (this.y - this.height / 2 > 0) {
            this.move(0, -1);
        }
    }

    moveDown() {
        if (this.y + this.height / 2 < canvas.height) {
            this.move(0, 1);
        }
    }

    increaseScore() {
        this.score++;
    }
}