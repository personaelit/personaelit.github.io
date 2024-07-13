class MazeGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.maze = this.createGrid();
        this.visited = this.createVisitedGrid();
    }

    createGrid() {
        let grid = [];
        for (let i = 0; i < this.height; i++) {
            let row = [];
            for (let j = 0; j < this.width; j++) {
                row.push(1); // 1 represents a wall
            }
            grid.push(row);
        }
        return grid;
    }

    createVisitedGrid() {
        let grid = [];
        for (let i = 0; i < this.height; i++) {
            let row = [];
            for (let j = 0; j < this.width; j++) {
                row.push(false); // false represents unvisited
            }
            grid.push(row);
        }
        return grid;
    }

    generateMaze(x, y) {
        let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.shuffleArray(directions);

        this.visited[x][y] = true;
        this.maze[x][y] = 0; // 0 represents a path

        for (let [dx, dy] of directions) {
            let nx = x + 2 * dx, ny = y + 2 * dy;

            if (this.isInBounds(nx, ny) && !this.visited[nx][ny]) {
                this.maze[x + dx][y + dy] = 0; // Carve path
                this.generateMaze(nx, ny);
            }
        }
    }

    isInBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.height && y < this.width;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    printMaze() {
        for (let row of this.maze) {
            console.log(row.join(''));
        }
    }
}

let width = 21; // Odd number to ensure there are walls around paths
let height = 21; // Odd number to ensure there are walls around paths
let mazeGenerator = new MazeGenerator(width, height);
mazeGenerator.generateMaze(1, 1); // Start maze generation from (1, 1)
mazeGenerator.printMaze();
