const input = `
Sue 1: children: 1, cars: 8, vizslas: 7
Sue 2: goldfish: 5, perfumes: 1, children: 3
Sue 3: cars: 5, pomeranians: 4, vizslas: 1
Sue 4: trees: 2, goldfish: 5, perfumes: 4
Sue 5: pomeranians: 2, trees: 11, children: 3
Sue 6: akitas: 4, vizslas: 4, trees: 0
`.trim();

export const tests = [
	{ part: 1, result: 2, input },
	{ part: 2, result: 5, input },
];
