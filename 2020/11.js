const fs = require('fs')
const data = fs.readFileSync('./11.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

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

const flip = (x, y, map) => {
	const currentState = map[y][x]
	if (currentState === state.FLOOR)
		return

	map[y][x] = currentState === state.EMPTY_SEAT
		? state.OCCUPIED_SEAT
		: state.EMPTY_SEAT
}

const areMapEquals = (a, b) =>
	mapToString(a) === mapToString(b)

const mapClone = map => [...map.map(row => [...row])]

const defineMap = (initialMap, shouldFlip) => {
	let map = initialMap.map(row => row.replace(/[^.]/g, '#').split(''))
	const seatPositions = fetchAllSeatPositions(data)

	let hasMapChanged = true
	while (hasMapChanged) {
		let newMap = mapClone(map)

		seatPositions
			.forEach(([x, y]) => {
				if (shouldFlip(x, y, map))
					flip(x, y, newMap)
			})

		hasMapChanged = !areMapEquals(map, newMap)
		map = newMap
	}

	return map
}

const countOccupiedSeats = map =>
	map.reduce(
		(total, row) =>
			total + row.join('')
				.replace(RegExp(`[^${state.OCCUPIED_SEAT}]`, 'g'), '')
				.length,
		0,
	)


const firstChallenge = data => {
	const MAX_OCCUPIED_SEATS = 3

	const fetchAdjacentWithState = (x, y, filterState, map) => {
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
				isWithinBoundaries(xi, yi) && map[yi][xi] === filterState
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

	return countOccupiedSeats(defineMap(data, shouldFlip))
}

const secondChallenge = data => {
	const MAX_OCCUPIED_SEATS = 4

	const fetchWithinVisionWithState = (x, y, filteredState, map) => {
		const isWithinBoundaries = (xi, yi) =>
			0 <= xi && x < map[0].length
			&& 0 <= yi && yi < map.length

		const directions = [
			[-1, -1], [0, -1], [1, -1],
			[-1, 0], /* center */ [1, 0],
			[-1, 1], [0, 1], [1, 1],
		]

		const buildNext = ([incX, incY]) => ([x, y]) => [x + incX, y + incY]

		const fetchFirstSeatRecursive = ([x, y], map, next) => {
			if (!isWithinBoundaries(x, y))
				return null

			if (map[y][x] !== state.FLOOR)
				return map[y][x]

			return fetchFirstSeatRecursive(next([x, y]), map, next)
		}

		return directions.reduce(
			(seats, increments) => {
				const next = buildNext(increments)
				const seat = fetchFirstSeatRecursive(next([x, y]), map, next)

				return seat === filteredState
					? [...seats, seat]
					: seats
			},
			[],
		)
	}

	const shouldFlip = (x, y, map) => {
		const currentState = map[y][x]
		if (currentState === state.FLOOR)
			return false

		const totalOccupied = fetchWithinVisionWithState(x, y, state.OCCUPIED_SEAT, map).length;

		return currentState === state.EMPTY_SEAT && totalOccupied === 0
			|| currentState === state.OCCUPIED_SEAT && totalOccupied > MAX_OCCUPIED_SEATS
	}

	return countOccupiedSeats(defineMap(data, shouldFlip))
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
