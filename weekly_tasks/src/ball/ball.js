
const radius = 10;
const ball = {x:20, y:0, dx: 5, dy: 1};
let   old  = {x: ball.x, y: ball.y};

function start() {
    const canvas= document.getElementById("canvas");
    canvas.style.backgroundColor = "yellow";
    const context = canvas.getContext("2d");
    context.fillStyle = "black";

    setInterval(() => {
        nextBoard(canvas);
        display(context);
    }, 1000 / 20);
}

function nextBoard(canvas) {
    // keep old ball values for the sake of efficient clearing of the old display
    old = {x: ball.x, y: ball.y};

    // handle ball is hitting the bounds
    //   reverse direction
    //   lose some energy relative to the current inertia (only velocity varies)
    function bounceOf(velocity) {
        const bounciness = 0.95;
        return -velocity * bounciness;
    }

    if (ball.y + radius >= canvas.height) {
        ball.y = canvas.height - radius;
        ball.dy = bounceOf(ball.dy);
    }

    if (ball.x - radius <= 0) {
        ball.x = radius;
        ball.dx = bounceOf(ball.dx);
    }

    if (ball.x + radius >= canvas.width) {
        ball.x = canvas.width - radius;
        ball.dx = bounceOf(ball.dx);
    }

    // calculate new position
    // calculate any changes in velocity due to gravitational pull or medium resistance
    ball.dy += 0.2;
    ball.y += ball.dy;
    ball.x += ball.dx;
}

function display(context) {
    context.clearRect(old.x - radius - 1 , old.y - radius -1 , 22, 22 );
    fillBox(context)
}

function fillBox(context) {
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 6.3, false);
    context.fill();
}


