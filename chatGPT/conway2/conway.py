import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Define the size of the grid
N = 50

# Initialize a grid with random values (0 or 1)
grid = np.random.choice([0, 1], N*N, p=[0.9, 0.1]).reshape(N, N)

def update(data):
    global grid
    # Copy grid since we need 8 neighbors for calculation and we go line by line
    new_grid = grid.copy()
    for i in range(N):
        for j in range(N):
            # Compute 8-neghbor sum
            total = int((grid[i, (j-1)%N] + grid[i, (j+1)%N] +
                         grid[(i-1)%N, j] + grid[(i+1)%N, j] +
                         grid[(i-1)%N, (j-1)%N] + grid[(i-1)%N, (j+1)%N] +
                         grid[(i+1)%N, (j-1)%N] + grid[(i+1)%N, (j+1)%N]))
            # Apply Conway's rules
            if grid[i, j] == 1:
                if (total < 2) or (total > 3):
                    new_grid[i, j] = 0
            else:
                if total == 3:
                    new_grid[i, j] = 1
    # Update data
    mat.set_data(new_grid)
    grid = new_grid
    return [mat]

fig, ax = plt.subplots()
mat = ax.matshow(grid)

ani = animation.FuncAnimation(fig, update, interval=200, save_count=50)
plt.show()
