export class GameObject {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    draw(context) {

    }

    intersects(other) {
        return this.x - this.width / 2 < other.x + other.width / 2
            && this.x + this.width / 2 > other.x - other.width / 2
            && this.y - this.height / 2 < other.y + other.height / 2
            && this.y + this.height / 2 > other.y - other.height / 2;
    }
}