export const validation = ['hepxxyzz', 'heqaabcc'];

export const formatInput = input => input;

const isSequence = str => str.split('')
	.every((c, i, s) =>
		i === 0 || c.charCodeAt(0) === 1 + s[i - 1].charCodeAt(0));

const incrementStr = str => {
	let updatedStr = str.split('');
	let current = updatedStr.length - 1;
	let carry = 1;
	while (carry && current >= 0) {
		if (updatedStr[current] === 'z') {
			updatedStr[current] = 'a';
			carry = 1;
		} else {
			updatedStr[current] = String.fromCharCode(updatedStr[current].charCodeAt(0) + carry);
			carry = 0;
		}
		current--;
	}

	if (carry)
		updatedStr.unshift('a');

	return updatedStr.join('');
}

const validCharacters = 'abcdefghijklmnopqrstuvwxyz'.replace(/[iol]/g, '');
const isPasswordValid = password => Object.values({
	eightCharachters: p => p.length === 8,
	validCharacters: p => RegExp(`^[${validCharacters}]*$`).test(p),
	sequenceOfThree: p => p.split('').some((_, idx) =>
		idx >= 3 && isSequence(p.slice(idx - 3, idx))),
	twoNonOverlappingPairs: p => /(.)\1{1}.*(.)\2{1}/.test(p),
})
	.every(rule => rule(password));

export const part1 = input => {
	let password = input;
	while (!isPasswordValid(password = incrementStr(password)));

	return password;
};

export const part2 = input => {
	return part1(part1(input));
};
