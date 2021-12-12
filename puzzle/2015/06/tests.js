const input1 = `
turn on 0,0 through 999,999
toggle 0,0 through 999,0
turn off 499,499 through 500,500
`.trim();
const input2 = `
turn on 0,0 through 0,0
toggle 0,0 through 999,999
`.trim();

export const tests = [
	{ part: 1, result: 998_996, input: input1 },
	{ part: 2, result: 2_000_001, input: input2 },
];
