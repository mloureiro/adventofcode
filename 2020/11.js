const fs = require('fs')
const data = fs.readFileSync('./11.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

const TOTAL_ITERATIONS = 4
const MAX_OCCUPIED_SEATS = 3
const state = {
	EMPTY_SEAT: 'L',
	OCCUPIED_SEAT: '#',
	FLOOR: '.',
}

const mapToString = map =>
	`====================
${map.map(row => row.join(' ')).join('\n')}
====================`

const fetchAllSeatPositions = map =>
	map.reduce((positions, row, y) => ([
			...positions,
			...row.split('')
				.reduce((rowPositions, position, x) =>
						position !== state.FLOOR
							? [...rowPositions, [x, y]]
							: rowPositions,
					[],
				)
		]),
		[],
	)

const fetchAdjacentWithState = (x, y, state, map) => {
	const isWithinBoundaries = (xi, yi) =>
		0 <= xi && x < map[0].length
			&& 0 <= yi && yi < map.length

	const positions = [
		[x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
		[x - 1, y], /* current position */ [x + 1, y],
		[x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
	]

	return positions.reduce(
		(adjacent, [xi, yi]) =>
			isWithinBoundaries(xi, yi) && map[yi][xi] === state
				? [...adjacent, map[yi][xi]]
				: adjacent,
		[],
	)
}

const shouldFlip = (x, y, map) => {
	const currentState = map[y][x]
	if (currentState === state.FLOOR)
		return false

	const totalOccupied = fetchAdjacentWithState(x, y, state.OCCUPIED_SEAT, map).length;

	return currentState === state.EMPTY_SEAT && totalOccupied === 0
		|| currentState === state.OCCUPIED_SEAT && totalOccupied > MAX_OCCUPIED_SEATS
}

const flip = (x, y, map) => {
	const currentState = map[y][x]
	if (currentState === state.FLOOR)
		return

	map[y][x] = currentState === state.EMPTY_SEAT
		? state.OCCUPIED_SEAT
		: state.EMPTY_SEAT
}

const mapClone = map => [...map.map(row => [...row])]

const firstChallenge = data => {
	let map = data.map(row => row.replace(/[^.]/g, '#').split(''))
	const seatPositions = fetchAllSeatPositions(data)

	for (let i = 0; i < TOTAL_ITERATIONS; i++) {
		let newMap = mapClone(map)

		seatPositions
			.forEach(([x, y]) => {
				if (shouldFlip(x, y, map))
					flip(x, y, newMap);
			})

		map = newMap

		console.log('Iteration: ', i + 1, '\n', mapToString(map))
	}

	return map.reduce(
		(total, row) =>
			total + row.join('')
				.replace(/[^#]/g, '')
				.length,
		0,
	)
}

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
