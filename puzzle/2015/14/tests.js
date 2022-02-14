const input = `
Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
`.trim();

export const tests = [
	{ part: 1, result: 1120, input, args: [1000] },
	{ part: 2, result: 689, input, args: [1000] },
];
