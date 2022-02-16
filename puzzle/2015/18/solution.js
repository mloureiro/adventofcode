export const validation = [821, 886];

export const formatInput = input => input.split('\n').map(s => s.split(''));

const STATES = {
	off: '.',
	on: '#',
};

const isWithinGrid = (row, col, grid) =>
	0 <= row && row < grid.length
	&& 0 <= col && col < grid[0].length;

const getNeigthboors = (row, col, grid) => {
	const neigthboors = [];
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (!(x === 0 && y === 0) && isWithinGrid(row + x, col + y, grid))
				neigthboors.push([row + x, col + y]);
		}
	}

	return neigthboors;
};

const countLightsOn = lights =>
	lights.filter(l => l === STATES.on).length;

const duplicateGrid = grid =>
	[...grid].map(row => [...row]);

const calculateGrid = (grid, iterations, isOnFn) => {
	let previous = duplicateGrid(grid);
	for (let i = 0; i < iterations; i++) {
		const newGrid = [];
		for (let x = 0; x < previous.length; x++) {
			for (let y = 0; y < previous[0].length; y++) {
				newGrid[x] = newGrid[x] || [];
				newGrid[x][y] = isOnFn([x, y], previous) ? STATES.on : STATES.off;
			}
		}
		previous = newGrid;
	}
	return previous;
};

const isOn = (light, neigthboors) => {
	const lightsOn = countLightsOn(neigthboors);
	return (light === STATES.on && [2, 3].includes(lightsOn))
		|| (light === STATES.off && lightsOn === 3)
};

export const part1 = (lightsGrid, iterations = 100) => {
	const isOnFn = ([x, y], grid) => {
		const neigthboors = getNeigthboors(x, y, grid).map(([nx, ny]) => grid[nx][ny]);
		return isOn(grid[x][y], neigthboors);
	};

	const finalGrid = calculateGrid(lightsGrid, iterations, isOnFn);
	return countLightsOn(finalGrid.flat());
};

// TODO improve performance (>1.5s)
export const part2 = (lightsGrid, iterations = 100) => {
	const isSquareEdge = ([x, y], grid) =>
		[
			[0, 0],
			[0, grid[0].length - 1],
			[grid.length - 1, 0],
			[grid.length - 1, grid[0].length - 1],
		]
			.some(([nx, ny]) => x === nx && y === ny);

	const isOnFn = ([x, y], grid) =>
		isSquareEdge([x, y], grid) || isOn(
			grid[x][y],
			getNeigthboors(x, y, grid)
				.map(([nx, ny]) =>
					isSquareEdge([nx, ny], grid) ? STATES.on : grid[nx][ny]));

	const finalGrid = calculateGrid(lightsGrid, iterations, isOnFn);
	return countLightsOn(finalGrid.flat());
};
