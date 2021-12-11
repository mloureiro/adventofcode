export const tests = [
	{ part: 1, result: 71, input: '1 + 2 * 3 + 4 * 5 + 6' },
	{ part: 1, result: 51, input: '1 + (2 * 3) + (4 * (5 + 6))' },
	{ part: 1, result: 26, input: '2 * 3 + (4 * 5)' },
	{ part: 1, result: 437, input: '5 + (8 * 3 + 9 + 3 * 4 * 3)' },
	{ part: 1, result: 12240, input: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))' },
	{ part: 1, result: 13632, input: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2' },
	{ part: 2, result: 231, input: '1 + 2 * 3 + 4 * 5 + 6' },
	{ part: 2, result: 51, input: '1 + (2 * 3) + (4 * (5 + 6))' },
	{ part: 2, result: 46, input: '2 * 3 + (4 * 5)' },
	{ part: 2, result: 1445, input: '5 + (8 * 3 + 9 + 3 * 4 * 3)' },
	{ part: 2, result: 669060, input: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))' },
	{ part: 2, result: 23340, input: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2' },
];
