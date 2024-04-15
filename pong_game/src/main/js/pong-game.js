import {Player} from "./player.js";
import {Ball} from "./ball.js";

const canvas = document.getElementById('pong-game');
const context = canvas.getContext('2d');

class PongGame {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        const playerHeight = this.canvas.height * 0.2;
        const playerWidth = 5;
        this.player1 = new Player(playerWidth*2, this.canvas.height / 2, playerHeight, playerWidth, 0);
        this.player2 = new Player(this.canvas.width - playerWidth*2, this.canvas.height / 2, playerHeight, playerWidth, 0);

        const ballSpeed = 1;
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, 5, ballSpeed, ballSpeed);
    }

    drawGame() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.player1.draw(this.context);
        this.player2.draw(this.context);
        this.ball.draw(this.context);
    }

    handleInput() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    this.player1.moveUp();
                    break;
                case 's':
                    this.player1.moveDown();
                    break;
                case 'ArrowUp':
                    this.player2.moveUp();
                    break;
                case 'ArrowDown':
                    this.player2.moveDown();
                    break;
            }
        });
    }

    step() {
        this.ball.move();
        if (this.ball.intersects(this.player1) || this.ball.intersects(this.player2)) {
            this.ball.bounceOfVertical();
        }
        if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvas.height) {
            this.ball.bounceOfHorizontal();
        }
        if (this.ball.x - this.ball.radius < 0) {
            this.player2.increaseScore();
            this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, 5, 1, 1);
        }
        if (this.ball.x + this.ball.radius > this.canvas.width) {
            this.player1.increaseScore();
            this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, 5, 1, 1);
        }
    }

    start() {
        setInterval(() => {
            this.drawGame();
            this.handleInput();
            this.step();
        }, 1000 / 20);
    }
}

const game = new PongGame(canvas, context);
game.start();