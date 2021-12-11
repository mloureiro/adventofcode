export const validation = [207, 848];

export const formatInput = input => input.split('\n').map(r => r.split(''));

const STATE = {
	active: '#',
	inactive: '.',
}

const TOTAL_CYCLES = 6

export const part1 = data => {
	const key = (x, y, z) =>
		`[${x}, ${y}, ${z}]`

	const extractKey = key =>
		key.replace(/(\[|\]|\s)/g, '')
			.split(',')
			.map(c => parseInt(c, 10))

	const SURROUNDINGS = (() => {
		const deviations = []
		for (let z = -1; z <= 1; z++)
			for (let y = -1; y <= 1; y++)
				for (let x = -1; x <= 1; x++)
					if (!(x === 0 && y === 0 && z === 0))
						deviations.push([x, y, z])

		return deviations
	})()

	const getSpaceOuterLayerCoordinates = space =>
		Object.keys(space).reduce(
			([xMin, xMax, yMin, yMax, zMin, zMax], key) => {
				const [x, y, z] = extractKey(key)

				if (xMin === null)
					return [x - 1, x + 1, y - 1, y + 1, z - 1, z + 1]

				if (x - 1 < xMin) xMin = x - 1
				if (x + 1 > xMax) xMax = x + 1
				if (y - 1 < yMin) yMin = y - 1
				if (y + 1 > yMax) yMax = y + 1
				if (z - 1 < zMin) zMin = z - 1
				if (z + 1 > zMax) zMax = z + 1

				return [xMin, xMax, yMin, yMax, zMin, zMax]
			},
			[null],
		)

	const getTotalActiveSurroundings = (currentKey, space) => {
		const [x, y, z] = extractKey(currentKey)

		return SURROUNDINGS.reduce(
			(total, [xd, yd, zd]) => {
				const newKey = key(x + xd, y + yd, z + zd)
				return total + (space[newKey] === STATE.active ? 1 : 0)
			},
			0,
		)
	}

	const evaluate = (currentState = null, totalActiveSurroundings) =>
		totalActiveSurroundings === 3
		|| currentState === STATE.active && totalActiveSurroundings === 2
			? STATE.active
			: STATE.inactive

	let space = {}
	for (let y = 0; y < data.length; y++)
		for (let x = 0; x < data[y].length; x++)
			space[key(x, y, 0)] = data[y][x]

	for (let i = 0; i < TOTAL_CYCLES; i++) {
		const newSpace = {}
		const [xMin, xMax, yMin, yMax, zMin, zMax] =
			getSpaceOuterLayerCoordinates(space)

		for (let z = zMin; z <= zMax; z++)
			for (let y = yMin; y <= yMax; y++)
				for (let x = xMin; x <= xMax; x++) {
					const currentKey = key(x, y, z);
					const totalActiveSurroundings = getTotalActiveSurroundings(currentKey, space)
					const nextState = evaluate(space[currentKey], totalActiveSurroundings)

					if (nextState === STATE.active)
						newSpace[currentKey] = STATE.active
				}

		space = newSpace
	}

	return Object.values(space).length
}

const key = coordinates =>
	`[${coordinates.join(',')}]`

const unwrapKey = key =>
	key.replace(/(\[|\]|\s)/g, '')
		.split(',')
		.map(p => parseInt(p, 10))

const getSurroundingCoordinates = coordinate => {
	const recursive = coordinate => {
		if (!coordinate || coordinate.length === 0)
			return null

		const currentDimension = coordinate.pop()
		const positions = [
			currentDimension + -1,
			currentDimension + 0,
			currentDimension + 1
		]

		if (coordinate.length === 0)
			return positions.map(p => [p])

		const children = recursive(coordinate)

		const coordinates = []
		for (let position of positions)
			for (let child of children)
				coordinates.push([...child, position])

		return coordinates
	}

	const extractCurrentCoordinate = (coordinate, surroundings) =>
		surroundings
			.filter(current => current.join(',') !== coordinate.join(','))

	return extractCurrentCoordinate(coordinate, recursive([...coordinate]))
}

const parseSpace = (rawSpace, totalDimensions) => {
	const recursive = (list, coordinate = []) => {
		if (!Array.isArray(list))
			return [[coordinate, list]]


		return [].concat(
			...list.map(
				(value, idx) => recursive(value, [...coordinate, idx])
			)
		)
	}

	return Object.fromEntries(
		recursive(rawSpace)
			.map(([coordinates, value]) => {
				while(coordinates.length < totalDimensions)
					coordinates.push(0)

				return [key(coordinates), value]
			})
	)
}

const calculateOuterLayerCoordinates = space => {
	const isMin = position => position % 2 === 0
	const deviation = position => isMin(position) ? -1 : 1

	return Object.keys(space).reduce(
		(coordinates, key) => {
			const keyCoordinates = unwrapKey(key)

			if (coordinates.length === 0)
				return Array(keyCoordinates.length * 2).fill(0)
					.map((_, idx) => keyCoordinates[Math.floor(idx / 2)] + deviation(idx))

			for (let i = 0; i < coordinates.length; i++) {
				const j = Math.floor(i / 2)
				const result = keyCoordinates[j] + deviation(i)
				if (
					isMin(i) && coordinates[i] > result
					|| !isMin(i) && coordinates[i] < result
				)
					coordinates[i] = result
			}

			return coordinates
		},
		[],
	)
}

const calculateAllPositionsForRanges = ([min, max, ...rest]) => {
	if (typeof min === 'undefined')
		return []

	const variations = []
	for (let i = min; i <= max; i++)
		variations.push(i)

	if (!rest || rest.length === 0)
		return variations

	const children = calculateAllPositionsForRanges(rest)

	return [].concat(
		...variations
			.map(v => children.map(c => Array.isArray(c) ? [v, ...c] : [v, c]))
	)
}

// TODO fix (real value is wrong)
export const part2 = data => {
	const TOTAL_DIMENSIONS = 4

	let space = parseSpace(data, TOTAL_DIMENSIONS)

	for (let i = 0; i < TOTAL_CYCLES; i++) {
		const coordinates = calculateAllPositionsForRanges(
			calculateOuterLayerCoordinates(space)
		)

		const newSpace = {}
		while (coordinates.length) {
			const next = coordinates.shift()
			const nextKey = key(next)
			const totalActiveSurroundings = getSurroundingCoordinates(next)
				.filter(current => space[key(current)] === STATE.active)
				.length

			if (
				totalActiveSurroundings === 3
				|| space[nextKey] === STATE.active && totalActiveSurroundings === 2
			)
				newSpace[nextKey] = STATE.active
		}

		space = newSpace
	}

	return Object.values(space).length
}
