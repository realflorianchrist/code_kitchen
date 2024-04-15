import {Player} from "./player.js";
import {Ball} from "./ball.js";

const canvas = document.getElementById('pong-game');
const context = canvas.getContext('2d');

class PongGame {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.registered = false;

        const playerHeight = this.canvas.height * 0.15;
        const playerWidth = 10;
        const playerSpeed = 20;
        this.player1 = new Player(canvas, playerWidth*2, this.canvas.height / 2, playerHeight, playerWidth, 0, playerSpeed);
        this.player2 = new Player(canvas, this.canvas.width - playerWidth*2, this.canvas.height / 2, playerHeight, playerWidth, 0, playerSpeed);

        const ballSpeed = 10;
        this.ball = new Ball(canvas, this.canvas.width / 2, this.canvas.height / 2, 10, ballSpeed, ballSpeed);
    }

    drawGame() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawScore();
        this.player1.draw(this.context);
        this.player2.draw(this.context);
        this.ball.draw(this.context);
    }

    drawScore() {
        this.context.fillStyle = 'rgb(23,255,0)';
        this.context.font = '24px Arial';

        this.context.fillText(this.player1.score + ' : ' + this.player2.score, this.canvas.width / 2, 50);
    }

    handleInput() {
        if (!this.registered) {
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
            this.registered = true;
        }
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
            this.ball.reset();
        }
        if (this.ball.x + this.ball.radius > this.canvas.width) {
            this.player1.increaseScore();
            this.ball.reset();
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