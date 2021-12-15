export const validation = [537, 2881];

export const formatInput = input =>
		input.split('\n').map(r => r.split('').map(Number));

const getAdjacents = (x, y, matrix)  => [
		[x - 1, y],
		[x + 1, y],
		[x, y - 1],
		[x, y + 1],
	].filter(([x, y]) =>
		0 <= x && x < matrix[0].length
		&& 0 <= y && y < matrix.length
	);

const shortestPathLength = (cave, start, end) => {
	const key = ([x, y]) => `${x},${y}`

	const visitedSet = {};

	const queue = [{ p: start, cost: 0}];
	while (queue.length) {
		const curr = queue.pop();
		if (key(curr.p) === key(end)) break;

		getAdjacents(...curr.p, cave)
			.forEach(([x, y]) => {
					const adjCost = visitedSet[key([x, y])] ?? Infinity;
					const newCost = curr.cost + cave[y][x];
					if (newCost < adjCost) {
						visitedSet[key([x, y])] = newCost;
						queue.push({p: [x, y], cost: newCost });
					}
			})
		queue.sort((a, b) => b.cost - a.cost);
	}

	return visitedSet[key(end)];
}

export const part1 = cave => {
	return shortestPathLength(cave, [0, 0], [cave[0].length - 1, cave.length - 1]);
};

const raise = (v, times) => {
	const total = times + Number(v);
	const carrier = Math.floor(total / 10);
	return (total + carrier) % 10 || 1;
}

const repeatCave = (times, baseCave) => {
	const [xMax, yMax] = [baseCave[0].length, baseCave.length];
	const cave = Array(yMax * times).fill(null).map(() => Array(xMax * times));
	for (let x = 0; x < xMax * times; x++)
		for (let y = 0; y < yMax * times; y++)
			cave[y][x] = raise(
				baseCave[y % yMax][x % xMax],
				Math.floor(x / xMax) + Math.floor(y / yMax),
			);

	return cave;
}

export const part2 = cave => {
	const largerCave = repeatCave(5, cave);
	return shortestPathLength(largerCave, [0, 0], [largerCave[0].length - 1, largerCave.length -1]);
};
