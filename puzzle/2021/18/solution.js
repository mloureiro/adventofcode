export const validation = [3935, 4669];

export function formatInput(input) {
	return input.split('\n')
		.map(r => r.split('')
			.filter(c => c != ',')
			.map(c => '[]'.includes(c) ? c : Number(c)));
}

function sailfishNumberToString(sailfishNumber) {
	return sailfishNumber.reduce((str, c, idx) => {
		if ((Number.isInteger(c) && (sailfishNumber[idx - 1] == ']' || Number.isInteger(sailfishNumber[idx - 1])))
			|| (Number.isInteger(sailfishNumber[idx - 1]) && c == '[')
			|| (sailfishNumber[idx - 1] == ']' && c == '[')
		)
			str += ',';
		return str + c;
	});
}

function findNextExplodeIndex(sailfishNumber) {
	let dept = 0;
	return sailfishNumber
		.findIndex(c => {
			if (c == '[') dept++;
			if (c == ']') dept--;
			return dept == 5; // assuming dept 5 is the max dept
		});
}

function findNextSplitIndex(sailfishNumber) {
	return sailfishNumber
		.findIndex(char => Number.isInteger(char) && char > 9);
}

function reduceByExplosion(sailfishNumber, explodeIndex) {
	// assuming the exploding pairs are regular pairs
	const REGULAR_PAIR_LENGTH = 4;
	const [a, b] = sailfishNumber.slice(explodeIndex + 1, explodeIndex + REGULAR_PAIR_LENGTH - 1);

	for (let i = explodeIndex - 1; i >= 0; i--)
		if (Number.isInteger(sailfishNumber[i])) {
			sailfishNumber[i] += a;
			break;
		}

	for (let i = explodeIndex + REGULAR_PAIR_LENGTH; i <= sailfishNumber.length; i++)
		if (Number.isInteger(sailfishNumber[i])) {
			sailfishNumber[i] += b;
			break;
		}

	sailfishNumber.splice(explodeIndex, REGULAR_PAIR_LENGTH);
	sailfishNumber.splice(explodeIndex, 0, 0);

	return sailfishNumber;
}

function reduceBySplit(sailfishNumber, splitIndex) {
	const value = sailfishNumber[splitIndex];
	sailfishNumber
		.splice(splitIndex, 1, ...['[', Math.floor(value / 2), Math.ceil(value / 2), ']']);

	return sailfishNumber;
}

function reduce(sailfishNumber) {
	let currentNumber = [...sailfishNumber];
	let explodeIndex;
	let splitIndex;
	while (
		(explodeIndex = findNextExplodeIndex(currentNumber)) != -1
		|| (splitIndex = findNextSplitIndex(currentNumber)) != -1
	) {
		if (explodeIndex != -1) {
			currentNumber = reduceByExplosion(currentNumber, explodeIndex);
		} else {
			currentNumber = reduceBySplit(currentNumber, splitIndex);
		}
	}

	return currentNumber;
}

function sumAndReduce(list) {
	return list.reduce(
		(final, curr) => reduce([
			'[',
			...final,
			...curr,
			']',
		], []),
	);
}

function magnitude(a, b) { return a * 3 + b * 2; }

function extractNextPair(sailfishNumber) {
	let dept = 0;
	const index = sailfishNumber.findIndex(i => {
		if (i == '[') dept++;
		if (i == ']') dept--;
		return dept == 0;
	});
	return [
		sailfishNumber.slice(0, index + 1),
		sailfishNumber.slice(index + 1, sailfishNumber.length),
	];
}

function getInnerSailfishNumbers(sailfishNumber) {
	const pairs = [];
	let remaining = sailfishNumber.slice(1, sailfishNumber.length - 1 );
	let currPair;
	while (remaining.length > 0) {
		[currPair, remaining] = extractNextPair(remaining)
		pairs.push(currPair)
	}
	return pairs.map(a => a.length === 1 ? a[0] : a);
}

function sailfishMagnitudeRec(a, b) {
	return magnitude(
		Array.isArray(a) ? sailfishMagnitudeRec(...getInnerSailfishNumbers(a)) : a,
		Array.isArray(b) ? sailfishMagnitudeRec(...getInnerSailfishNumbers(b)) : b,
	);
}

export const part1 = input => {
	return sailfishMagnitudeRec(
		...getInnerSailfishNumbers(
			sumAndReduce(input)
		)
	);
};

export const part2 = input => {
	return input.reduce(
		(maxMagnitude, a, aIdx) =>
			Math.max(
				maxMagnitude,
				...input.map((b, bIdx) => aIdx == bIdx ? 0 : part1([a, b]))),
		0,
	)
};
