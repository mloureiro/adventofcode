export const validation = [13203, 5644];

export const formatInput = input =>
	input.match(/^target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)$/)
		.slice(1, 5)
		.map(Number);

const isInTargetArea = (x, y, xs, xe, ys, ye) => xs <= x && x <= xe && ys <= y && y <= ye;
const hasPassedTargetArea = (x, y, xe, ye) => x > xe || y < ye;

const calculateMaxHeight = (vx, vy, xs, xe, ys, ye) => {
	let maxHeight = -Infinity;
	for (
		let [x, y] = [0, 0];
		!hasPassedTargetArea(x, y, xe, ys);
		x += vx, vx -= Math.sign(vx),
			y += vy, vy--
	) {
		if (maxHeight < y) maxHeight = y;
		if (isInTargetArea(x, y, xs, xe, ys, ye)) return maxHeight;
	}
};

const calculateVelocities = (xs, xe, ys, ye) => {
	const velocities = [];
	for (let vy = ys; vy < -ys; vy++) {
		for (let vx = xe; vx > 0; vx--) {
			let maxHeight = calculateMaxHeight(vx, vy, xs, xe, ys, ye);
			if (maxHeight != null)
				velocities.push([vx, vy, maxHeight]);
		}
	}

	return velocities;
}

export const part1 = input => {
	return Math.max(...calculateVelocities(...input).map(c => c[2]));
};

export const part2 = input => {
	return calculateVelocities(...input).length;
};
