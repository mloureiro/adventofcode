const input1 = `
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
`.trim();

const input2 = `
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
Dublin to Manchester = 622
Belfast to Manchester = 392
`.trim();

export const tests = [
	{ part: 1, result: 605, input: input1 },
	{ part: 1, result: 997, input: input2 },
	{ part: 2, result: 982, input: input1 },
	{ part: 2, result: 1604, input: input2 },
];
