export const validation = [280, 1797];

export const formatInput = input => input.split('');

export const part1 = input => {
	return input.reduce((a, c) => a + (c === '(' ? 1 : -1), 0);
};

export const part2 = input => {
	let floor = 0;
	return 1 + input.findIndex(c => {
		floor += (c === '(' ? 1 : -1);
		return floor === -1;
	});
};
