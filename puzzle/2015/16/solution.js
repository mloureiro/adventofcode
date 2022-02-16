export const validation = [213, 323];

export const formatInput = input =>
	input.split('\n')
		.map(s => s.match(/^.*?:\s(.*)/)[1])
		.map(s => Object.fromEntries(strToThingsList(s)));

const tickerTapeAnalyse = `
children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1
`.trim().replace(/\n/g, ' ');

const strToThingsList = str =>
	str.match(/\w+: \d+/g)
		.map(s => s.split(':')
			.reduce((thing, count) => [thing, parseInt(count)]))

export const part1 = aunties => {
	const things = strToThingsList(tickerTapeAnalyse);
	return 1 + aunties.findIndex(aunt =>
		things.every(([thing, count]) =>
			aunt[thing] === undefined || aunt[thing] === count));
};

const isThingFromSue = ([thing, count], sueBelongings) => {
	switch (thing) {
		case 'cats':
		case 'trees':
			return sueBelongings[thing] > count;
		case 'pomeranians':
		case 'goldfish':
			return sueBelongings[thing] < count;
		default:
			return sueBelongings[thing] === count;
	}
};

export const part2 = aunties => {
	const things = strToThingsList(tickerTapeAnalyse);
	return 1 + aunties.findIndex(aunt =>
		things.every(([thing, count]) =>
			aunt[thing] === undefined || isThingFromSue([thing, count], aunt)));
};
