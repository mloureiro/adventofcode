const input = s => `
123 -> x
456 -> y
${s}
`.trim();

export const tests = [
	{ part: 1, result: 72, input: input('x AND y -> a') },
	{ part: 1, result: 507, input: input('x OR y -> a') },
	{ part: 1, result: 492, input: input('x LSHIFT 2 -> a') },
	{ part: 1, result: 114, input: input('y RSHIFT 2 -> a') },
	{ part: 1, result: 65412, input: input('NOT x -> a') },
	{ part: 1, result: 65079, input: input('NOT y -> a') },
];
