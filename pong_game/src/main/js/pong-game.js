import {Player} from "./player.js";
import {Ball} from "./ball.js";

const canvas = document.getElementById('pong-game');
const context = canvas.getContext('2d');
const menu = document.getElementById('menu');
const title = document.getElementById('title');
const startButton = document.getElementById('start-button');
const score = document.getElementById('score');

export class PongGame {
    constructor() {
        this.canvas = canvas;
        this.context = context;
        this.menu = menu;
        this.title = title;
        this.startButton = startButton;
        this.score = score;

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
        this.score.textContent = `${this.player1.score} : ${this.player2.score}`;
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
                    this.toggleStartScreen();
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
        if (this.player1.score >= 10 || this.player2.score >= 10) {
            this.gameOverScreen();
            this.player1.resetScore();
            this.player2.resetScore();
        }
    }

    startScreen() {
        this.startButton.addEventListener('click', () => {
            this.menu.style.display = 'none';
            this.title.textContent = 'Pong Game';
            this.startButton.textContent = 'resume';
            this.pause();
        });
    }

    toggleStartScreen() {
        if (this.paused) {
            this.menu.style.display = 'flex';
        } else {
            this.menu.style.display = 'none';
        }
    }

    gameOverScreen() {
        this.title.textContent = 'Game Over';
        this.startButton.textContent = 'restart';
        this.pause();
        this.toggleStartScreen();
    }

    start() {
        this.intervalId = setInterval(() => {
            if (!this.paused) {
                this.drawGame();
                this.handleInput();
                this.step();
            }
        }, 1000 / 20);
    }

    pause() {
        if (this.paused) {
            this.start();
        } else {
            clearInterval(this.intervalId);
        }
        this.paused = !this.paused;
    }
}

const game = new PongGame(canvas, context, menu, startButton);
game.startScreen();