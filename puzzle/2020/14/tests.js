const input1 = `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`.trim();

const input2 = `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`.trim();

export const tests = [
	{ part: 1, input: input1, result: 165 },
	{ part: 2, input: input2, result: 208 },
];
