export const formatInput = input => input.split('\n');

const CHARACTER_MATCH = {
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>',
};

const OPEN_CHARACTERS = Object.keys(CHARACTER_MATCH);

const ILEGAL_CHARACTER_SCORE = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
};

const CLOSING_CHARACTER_SCORE = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
};

const findIllegalCharacter = subsystem => {
	const queue = [];
	return subsystem.split('')
			.find(c => {
				if (OPEN_CHARACTERS.includes(c)) {
					queue.push(c);
					return false;
				}

				const top = queue.pop();
				return c !== CHARACTER_MATCH[top];
			})
		|| null;
};

export const part1 = input => {
	return input.reduce((a, subsystem) => {
		const result = findIllegalCharacter(subsystem)

		return ILEGAL_CHARACTER_SCORE[result]
			? a + ILEGAL_CHARACTER_SCORE[result]
			: a;
	}, 0);
};

export const part2 = input => {
	const fetchUnclosedCharacters = subsystem => {
		const queue = [];
		subsystem.split('')
				.forEach(c => {
					if (OPEN_CHARACTERS.includes(c)) {
						queue.push(c);
						return;
					}

					const top = queue.pop();
					if (c !== CHARACTER_MATCH[top])
						throw Error('Subsystem is corrupt')
				});

		return queue.reverse().map(c => CHARACTER_MATCH[c]).join('');
	}

	const calculateUnclosedScore = characters =>
		characters.split('')
			.reduce((a, c) =>  (a * 5) + CLOSING_CHARACTER_SCORE[c],0)

	const scores =  input.filter(s => findIllegalCharacter(s) === null)
		.map(fetchUnclosedCharacters)
		.map(calculateUnclosedScore)
		.sort((a, b) => a < b ? -1 : 1);

	return scores[Math.floor(scores.length / 2)];
};
