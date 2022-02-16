export const validation = [492982, 6989950];

export const formatInput = input => input;

const lookAndSay = sequence => {
	let count = 1;
	let previous = null;
	let result = '';
	for (let c of sequence) {
		if (!previous) { // first char
			previous = c;
		} else if (c === previous) {
			count++;
		} else {
			result += `${count}${previous}`;
			previous = c;
			count = 1;
		}
	}

	return result + `${count}${previous}`; // handle last char
};

export const part1 = (input, customIterations = null) => {
	const times = customIterations || 40;
	let sequence = input;
	for (let i = 0; i < times; i++)
		sequence = lookAndSay(sequence)
	return customIterations
		? sequence // return the sequence if we're running the custom tests
		: sequence.length;
};

// TODO improve performance (>5s)
export const part2 = input =>
	part1(input, 50).length;
