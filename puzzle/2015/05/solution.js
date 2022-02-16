export const validation = [258, 53];

export const formatInput = input => input.split('\n');

export const part1 = input => {
	const validate = string => [
		s => s.replace(/[^aeiou]/g, '').length >= 3,
		s => s.split('').some((c, idx) => c === s[idx - 1]),
		s => ['ab', 'cd', 'pq', 'xy'].every(v => !s.includes(v))
	]
		.every(val => val(string));

	return input.filter(s => validate(s)).length;
};

export const part2 = input => {
	const validate = string => [
		s => /(\w{2}).*\1/.test(s),
		s => /(\w).\1/.test(s),
	]
		.every(val => val(string))

	return input.filter(s => validate(s)).length;
};
