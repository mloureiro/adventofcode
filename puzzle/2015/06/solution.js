export const validation = [569999, 17836115];

export const formatInput = input => input.split('\n')
	.map(instruction => {
		const [, action, xs, ys, xe, ye] =
			instruction.match(/^(turn on|turn off|toggle)\s*(\d+),(\d+).*?(\d+),(\d+)$/)

		return [action, Number(xs), Number(ys), Number(xe), Number(ye)]
	});

const createMap = (width, length) =>
	Array(width).fill(null)
		.map(() => Array(length).fill(0))

const execute = (map, action, xs, ys, xe, ye) => {
	for (let x = xs; x <= xe; x++)
		for (let y = ys; y <= ye; y++)
			map[x][y] = action(map[x][y])
}

export const part1 = input => {
	const applyAction = action => state => {
		switch (action) {
			case 'turn on': return 1;
			case 'turn off': return 0;
			case 'toggle': return state === 1 ? 0 : 1;
		}
	}

	const map = createMap(1000, 1000);
	input.forEach(([action, ...props]) => execute(map, applyAction(action), ...props))
	return map.reduce(
		(a, r) => a + r.reduce((t, s) => t + s, 0),
		0,
	);
};

// TODO improve performance (>1s)
export const part2 = input => {
	const applyAction = action => state => {
		switch (action) {
			case 'turn on': return state + 1;
			case 'turn off': return state === 0 ? 0 : state - 1;
			case 'toggle': return state + 2;
		}
	}

	const map = createMap(1000, 1000);
	input.forEach(([action, ...props]) => execute(map, applyAction(action), ...props))
	return map.reduce(
		(a, r) => a + r.reduce((t, s) => t + s, 0),
		0,
	);
};
