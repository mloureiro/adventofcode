const fs = require('fs')
const data = fs.readFileSync('./17.txt')
	.toString()
	.trim()
	.split('\n')
	.map(line => line.split(''))

const STATE = {
	active: '#',
	inactive: '.',
}

const TOTAL_CYCLES = 6

const firstChallenge = data => {
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

	const logSpace = space => {
		const [xMin, xMax, yMin, yMax, zMin, zMax] =
			getSpaceOuterLayerCoordinates(space)

		console.group('Space')
		for (let z = zMin + 1; z < zMax; z++) {
			console.group(`z = ${z}:`)
			for (let y = yMin + 1; y < yMax; y++) {
				let line = ''
				for (let x = xMin + 1; x < xMax; x++) {
					line += space[key(x, y, z)] || '.'
				}
				console.log(line)
			}
			console.groupEnd()
		}
		console.groupEnd()
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

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
