import {Player} from "./player.js";
import {Ball} from "./ball.js";

const canvas = document.getElementById('pong-game');
const context = canvas.getContext('2d');

class PongGame {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.paused = true;
        this.intervalId = null;
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
        this.context.textAlign = 'center';

        this.context.fillText(this.player1.score + ' : ' + this.player2.score, this.canvas.width / 2, 50);
    }

    handleInput() {
        if (!this.registered) {
            const playerControlListener = (event) => {
                if (!this.paused) {
                    const keyActions = {
                        'w': () => this.player1.moveUp(),
                        's': () => this.player1.moveDown(),
                        'ArrowUp': () => this.player2.moveUp(),
                        'ArrowDown': () => this.player2.moveDown()
                    };

                    const action = keyActions[event.key];
                    if (action) {
                        action();
                    }
                }
            };

            const pauseMenuListener = (event) => {
                if (event.key === 'Escape') {
                    this.pause();
                }
            };

            document.addEventListener('keydown', playerControlListener);
            document.addEventListener('keydown', pauseMenuListener);

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
        if (!this.paused) {
            this.intervalId = setInterval(() => {
                this.drawGame();
                this.handleInput();
                this.step();
            }, 1000 / 20);
        }
    }

    pause() {
        if (!this.paused) {
            clearInterval(this.intervalId);
        } else {
            this.start();
        }
        this.paused = !this.paused;
    }
}

const game = new PongGame(canvas, context);
game.start();