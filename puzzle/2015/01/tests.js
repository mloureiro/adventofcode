export const tests = [
	{ part: 1, result: 0, input: '(())' },
	{ part: 1, result: 0, input: '()()' },
	{ part: 1, result: 3, input: '(((' },
	{ part: 1, result: 3, input: '(()(()(' },
	{ part: 1, result: 3, input: '))(((((' },
	{ part: 1, result: -1, input: '())' },
	{ part: 1, result: -1, input: '))(' },
	{ part: 1, result: -3, input: ')))' },
	{ part: 1, result: -3, input: ')())())' },
	{ part: 2, result: 1, input: ')' },
	{ part: 2, result: 5, input: '()())' },
];
