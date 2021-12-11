const input = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`.trim();

export const tests = [
	{ part: 1, input, result: 5 },
	{ part: 2, input, result: 8 },
];
