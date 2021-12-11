export const validation = [39984, 8468];

export const formatInput = input => {
	const [sequence, ...boards] = input.split('\n\n');

	return {
		sequence: sequence.split(',').map(v => parseInt(v, 10)),
		boards: boards.map(
			b => b.split('\n').map(
				r => r.trim()
					.replace(/\s+/g, ',')
					.split(',')
					.map(v => parseInt(v, 10))))
	}
}

const excludeFromList = (list, exclusion) => list.filter(v => !exclusion.includes(v))

export const part1 = ({ sequence, boards }) => {
	const valueMap = {}

	const addToValueMap = (value, key, list) => {
		if (!valueMap[value]) valueMap[value] = []
		valueMap[value].push([key, list])
	}

	for (let key = 0; key < boards.length; key ++) {
		const board = boards[key]

		for (let j = 0; j < board.length; j++) {
			const row = []
			const column = []
			for (let k = 0; k < board.length; k++) {
				const rowValue = board[j][k];
				row.push(rowValue)

				const columnValue = board[k][j];
				column.push(columnValue)

				addToValueMap(rowValue, key, row)
				addToValueMap(columnValue, key, column)
			}
		}
	}

	const numbers = {}
	let lastNumber = null
	let winner = null
	for (let i = 0; i < sequence.length && !winner; i++) {
		lastNumber = sequence[i];
		numbers[sequence[i]] = true;

		for (let j = 0; j < valueMap[lastNumber].length && !winner; j++) {
			const [key, list] = valueMap[lastNumber][j];

			list.splice(list.findIndex(v => v === lastNumber), 1)
			if (list.length === 0) winner = key;
		}
	}

	const boardNumbers = boards[winner].flat()

	return lastNumber * boardNumbers.reduce((a, v) => numbers[v] ? a : a + v,0)
}

export const part2 = ({ sequence, boards }) => {
	const sequenceMap = {};
	sequence.forEach((v, i) => sequenceMap[v] = i)

	const winningRound = [];
	boards.forEach(board => {
		let firstWin = Number.MAX_SAFE_INTEGER
		for (let x = 0; x < board.length; x++) {
			let rowLastIndex = 0
			let columnLastIndex = 0
			for (let y = 0; y < board.length; y++) {
				const rowIndex = sequenceMap[board[x][y]];
				const columnIndex = sequenceMap[board[y][x]];

				if (rowLastIndex < rowIndex) rowLastIndex = rowIndex
				if (columnLastIndex < columnIndex) columnLastIndex = columnIndex
			}
			if (firstWin > rowLastIndex) firstWin = rowLastIndex
			if (firstWin > columnLastIndex) firstWin = columnLastIndex
		}

		winningRound.push(firstWin);
	})

	const lastBoardToWinIndex = winningRound.reduce((a, v, i) => winningRound[a] < v ? i : a, 0)
	const lastBoardNumbers = boards[lastBoardToWinIndex].flat()
	const unmarkedNumbers = excludeFromList(lastBoardNumbers, sequence.slice(0, winningRound[lastBoardToWinIndex] + 1))
	const sum = unmarkedNumbers.reduce((a, v) => a + v, 0)

	return sum * sequence[winningRound[lastBoardToWinIndex]]
}
