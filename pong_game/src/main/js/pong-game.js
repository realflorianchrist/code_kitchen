import {Player} from "./player.js";

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
    }

    drawGame() {
        this.player1.draw(this.context);
        this.player2.draw(this.context);
    }

    start() {
        this.drawGame();
    }
}

const game = new PongGame(canvas, context);
game.start();