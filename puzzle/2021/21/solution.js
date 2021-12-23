export const validation = [1004670, 492043106122795];

export const formatInput = input =>
	input.split('\n').map(l => l.split(': ')[1]).map(Number);

function moveAndSome(pos, sum, moves) {
	const nextPos = pos + moves;
	return [nextPos, sum + (nextPos % 10 || 10)]
}

function deterministicMoveAndSum(startPosition, sum, diceStartPosition) {
	return moveAndSome(startPosition, sum, [1, 2, 3].reduce((s, c) => s + c + diceStartPosition, 0));
}

export const part1 = ([startOne, startTwo]) => {
	let oneSum = 0, twoSum = 0;
	let onePos = startOne, twoPos = startTwo;
	let diceRolls = 0
	while (oneSum < 1000 && twoSum < 1000) {
		if (diceRolls % 2 === 0) {
			[onePos, oneSum] = deterministicMoveAndSum(onePos, oneSum, diceRolls);
		} else {
			[twoPos, twoSum] = deterministicMoveAndSum(twoPos, twoSum, diceRolls);
		}
		diceRolls += 3;
	}

	return diceRolls * Math.min(oneSum, twoSum);
};

const WINNING_VALUE = 21;
const toKey = (...parts) => '' + parts;
const calculatedGames = {};
function playNextIterationRec(currentPlayerPosition, nextPlayerPosition, currentPoints, nextPoints) {
	if (currentPoints >= WINNING_VALUE) return [1, 0];
	if (nextPoints >= WINNING_VALUE) return [0, 1];

	const key = toKey(currentPlayerPosition, nextPlayerPosition, currentPoints, nextPoints);
	if (calculatedGames[key]) return calculatedGames[key];

	let victories = [0, 0]
	for (const d1 of [1, 2, 3])
		for (const d2 of [1, 2, 3])
			for (const d3 of [1, 2, 3]) {
				const nextPosition = (currentPlayerPosition + d1 + d2 + d3) % 10;
				const nextSum = currentPoints + nextPosition + 1;
				const [one, two] = playNextIterationRec(
					nextPlayerPosition,
					nextPosition,
					nextPoints,
					nextSum,
				);

				victories = [victories[0] + two, victories[1] + one];
			}

	calculatedGames[key] = victories;
	return victories;
}

export const part2 = ([startOne, startTwo]) => {
	return Math.max(...playNextIterationRec(startOne - 1, startTwo - 1, 0, 0));
};
