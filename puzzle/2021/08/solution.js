export const validation = [476, 1011823];

export const formatInput = input => input.split('\n');

const invertObject = obj => Object.fromEntries(Object.entries(obj).map(([k,v]) => [v,k]))

const DIGITS_LENGTH = {
	0: 6,
	1: 2,
	2: 5,
	3: 5,
	4: 4,
	5: 5,
	6: 6,
	7: 3,
	8: 7,
	9: 6,
}

const DIGITS_BY_LENGTH = invertObject(DIGITS_LENGTH)

const SEGMENTS = {
	'abcefg': 0,
	'cf': 1,
	'acdeg': 2,
	'acdfg': 3,
	'bcdf': 4,
	'abdfg': 5,
	'abdefg': 6,
	'acf': 7,
	'abcdefg': 8,
	'abcdfg': 9,
}

const SEGMENTS_BY_DIGIT = invertObject(SEGMENTS)

const uniqueLength = Object.values(DIGITS_LENGTH)
	.filter((v, i, l)  => l.every((vc, ic) => ic == i || vc != v))

const filterByUniqueLength = v => uniqueLength.includes(v.length)

export const part1 = data =>
	data.map(r => r.replace(/^.*\|\s?/g, '').split(' ')).flat()
		.filter(d => uniqueLength.includes(d.length))
		.length

const calculateDigits = allDigits => {
	const segmentMap = Object.fromEntries('abcdefg'.split('').map(v => [v, null]));
	const digitsByLength = allDigits
		.reduce((a, v) => {
			if (!a[v.length]) a[v.length] = []
			a[v.length].push(v)
			return a
		}, {})

	const one = digitsByLength[2][0];
	const four = digitsByLength[4][0];
	const two = digitsByLength[5].find(d => d.split('').filter(s => !four.includes(s)).length === 3)
	const three =  digitsByLength[5].find(d => d.split('').filter(s => !two.includes(s)).length === 1)
	const five =  digitsByLength[5].find(d => d.split('').filter(s => !two.includes(s)).length === 2)
	const seven = digitsByLength[3][0];

	// TODO find a better way to handle this
	segmentMap.a = seven.split('').filter(s => !one.includes(s))[0]
	segmentMap.b = four.split('').filter(s => !(two + one).includes(s))[0]
	segmentMap.e = two.split('').filter(s => !three.includes(s))[0]
	segmentMap.c = two.split('').filter(s => !(five + segmentMap.e).includes(s))[0]
	segmentMap.d = four.split('').filter(s => !(one + segmentMap.b).includes(s))[0]
	segmentMap.f = one.split('').filter(s =>  s != segmentMap.c )[0]
	segmentMap.g = three.split('').filter(s => !(four + segmentMap.a).includes(s))[0]

	return invertObject(segmentMap);
}

const fixSegments = (digit, segmentMap) =>
	digit.split('').map(s => segmentMap[s]).join('')

const sortSegments = digit =>
	digit.split('').sort((a, b) => a < b ? -1 : 1).join('')

const segmentsToNumber = digit =>
	SEGMENTS[digit];

const calculateDigit = (digit, map) =>
	SEGMENTS[digit.split('').map(d => map[d]).sort((a, b) => a < b ? -1 : 1).join('')];

export const part2 = data => {
	let total = 0
	for (let i = 0; i < data.length; i++) {
		const row = data[i]
		const [allDigits, resultDigits] = row.split(' | ').map(v => v.split(' '))
		const segmentMap = calculateDigits(allDigits);
		total += Number(resultDigits.map(s => calculateDigit(s, segmentMap)).join(''))
	}

	return total
}
