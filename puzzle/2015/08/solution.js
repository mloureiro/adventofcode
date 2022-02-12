export const validation = [1371, 2117];

export const formatInput = input => input.trim().split('\n');

/**
 * @function matcher
 * @param {string} s
 * @returns {boolean}
 * 
 * @function parser
 * @param {string} s
 * @returns {string}
 * 
 * @var {[[matcher, parser]]} decodeRules
 */
const decodeRules = [
	[s => s === '\\\\', () => '\\'],
	[s => s === '\\"', () => '"'],
	[
		s => s.match(/^\\x[\da-f]{2}$/i),
		s => String.fromCharCode(parseInt(s.slice(2), 16)),
	],
];

const decodeString = str => {
	let currentChar = '';
	return str.split('')
		.reduce((acc, char) => {
			if (!currentChar && char !== '\\') return acc + char;

			currentChar += char;
			const [, parser] = decodeRules.find(([macther]) => macther(currentChar)) || [];

			if (!parser) return acc;

			acc += parser(currentChar);
			currentChar = '';

			return acc;
		}, '');
};

const encodeString = str => {
	const isCharDangerous = char => ['\\', '"'].includes(char);
	return str.split('')
		.reduce((acc, char) =>
			acc + (isCharDangerous(char) ? '\\' : '') + char,
			'',
		)
}

const calculateEncodedVsDecodedLength = stringList =>
	stringList
		.reduce(
			([encoded, decoded], string) => [
				encoded + string.length,
				decoded + decodeString(string.substr(1, string.length - 2)).length,
			],
			[0, 0],
		)
		.reduce((encoded, decoded) => encoded - decoded);

export const part1 = calculateEncodedVsDecodedLength;

export const part2 = input =>
	calculateEncodedVsDecodedLength(
		input
			.map(string => encodeString(string))
			.map(s => `"${s}"`))
