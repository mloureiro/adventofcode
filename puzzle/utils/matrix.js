
export const cloneMatrix = matrix => [...matrix.map(r => [...r])]

export const pointFactory = (x, y, v) => {
	let internalValue = v;

	return Object.freeze({
		x,
		y,
		key: `[${x},${y}]`,
		get v() { return internalValue },
		set v(v) { internalValue = v },
		toString() {
			return `${this.key}: ${internalValue}`
		}
	});
}

export const createMatrix = initialMatrix => {
	let matrix = cloneMatrix(initialMatrix)

	const maxX = matrix[0].length;
	const maxY = matrix.length;

	const isWithinBounds = ([y, x]) => 0 <= y && y < maxY && 0 <= x && x < maxX;

	const makePoint = ([y, x]) => pointFactory(x, y, matrix[y][x]);

	return Object.freeze({
		maxX,
		maxY,
		get(x, y) { return makePoint([y, x]) },
		set(x, y, v) { matrix[y][x] = v },
		getAdjacents(x, y) {
			return [
				[y - 1, x],
				[y + 1, x],
				[y, x - 1],
				[y, x + 1],
			]
				.filter(isWithinBounds)
				.map(makePoint)
		},
		getAdjacentsWithDiagonal(x, y) {
			return [
				...this.getAdjacents(x, y),
				...[
					[y - 1, x - 1],
					[y - 1, x + 1],
					[y + 1, x - 1],
					[y + 1, x + 1],
				]
					.filter(isWithinBounds)
					.map(makePoint)
			];
		},
		toString() {
			// TODO handle multiple node length
			return matrix.map(r => r.join('')).join('\n');
		}
	});
};
