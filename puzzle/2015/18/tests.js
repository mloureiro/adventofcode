const input1 = `
.#.#.#
...##.
#....#
..#...
#.#..#
####..
`.trim();

const input2 = `
##.#.#
...##.
#....#
..#...
#.#..#
####.#
`.trim();

export const tests = [
	{ part: 1, result: 4, input: input1, args: [4] },
	{ part: 2, result: 17, input: input2, args: [5] },
];
