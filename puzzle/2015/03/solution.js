export const validation = [2572, 2631];

export const formatInput = input => input.split('');

const createHouseVisits = () => {
	const houses = new Set();
	const addPosition = ([x, y]) => houses.add(`${x},${y}`)
	const move = ([x, y], step) => {
		switch (step) {
			case '^': return [x, y + 1];
			case 'v': return [x, y - 1];
			case '>': return [x + 1, y];
			case '<': return [x - 1, y];
		}
	}

	let position = [0, 0];
	addPosition(position);

	return {
		get size() { return houses.size; },
		get houses() { return [...houses] },
		move(step) {
			position = move(position, step);
			addPosition(position);
		},
	};
};

export const part1 = input => {
	const housesVisits = createHouseVisits();
	input.forEach(housesVisits.move);
	return housesVisits.size;
};

export const part2 = input => {
	const robot = createHouseVisits();
	const santa = createHouseVisits();
	input.forEach((step, idx) => (idx % 2 ? robot : santa).move(step));
	return (new Set([
		...robot.houses,
		...santa.houses,
	])).size;
};
