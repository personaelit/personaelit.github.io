export class CanvasLayer {
    constructor(id, animationFn, zIndex) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = id;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = zIndex;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.animationFn = animationFn;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.animate();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.clearCanvas();
        if (this.animationFn) {
            this.animationFn(this.ctx, this.canvas.width, this.canvas.height);
        }
    }
}
