export const formatInput = input => input.split('\n').filter(Boolean);

const INITIAL_DIRECTION = 'E'
const COMPASS = ['N', 'E', 'S', 'W']

const parseInstruction = instruction => {
	const [, action, amount] = instruction.match(/^([NSEWLRF])(\d+)$/)

	if (!action)
		throw Error(`Instruction "${instruction}" is not valid`)

	return [action, parseInt(amount, 10)]
}

const rotate = (currentDirection, [side, degrees]) => {
	let totalShifts = degrees / 90
	if (side === 'L')
		totalShifts *= -1

	const currentDirectionIndex = COMPASS.findIndex( direction => direction === currentDirection)
	let newDirection = currentDirectionIndex + totalShifts
	if (newDirection < 0)
		newDirection += COMPASS.length
	else if (newDirection >= COMPASS.length)
		newDirection -= COMPASS.length

	return COMPASS[newDirection]
}

export const part1 = data => {
	const executeAction = ([action, amount], direction, [x, y]) => {
		const actionToBeExecuted = action !== 'F' ? action : direction

		switch (actionToBeExecuted) {
			case 'N':
				return [direction, [x, y + amount]]
			case 'S':
				return [direction, [x, y - amount]]
			case 'E':
				return [direction, [x + amount, y]]
			case 'W':
				return [direction, [x - amount, y]]
			case 'L':
			case 'R':
				return [rotate(direction, [action, amount]), [x, y]]
			default:
				throw Error(`Action "${actionToBeExecuted}" is not supported`)
		}
	}

	let direction = INITIAL_DIRECTION
	let position = [0, 0]

	for (let instruction of data) {
		const [newDirection, newPosition] = executeAction(
			parseInstruction(instruction),
			direction,
			position
		)
		position = newPosition
		direction = newDirection
	}

	return Math.abs(position[0]) + Math.abs(position[1])
}

export const part2 = data => {
	const moveShip = ([x, y], [wx, wy], amount) => [
		x + (wx * amount),
		y + (wy * amount),
	]

	const rotateWaypoint = (initialCoordinates, [side, degrees]) => {
		const shiftRight = ([x, y]) => [y, x * -1]
		const shiftLeft = ([x, y]) => [y * -1, x]
		const shift = side === 'R' ? shiftRight : shiftLeft

		let currentCoordinates = initialCoordinates
		const shifts = (degrees / 90) % 4
		for (let i = 0; i < shifts; i++) {
			currentCoordinates = shift(currentCoordinates)
		}

		return currentCoordinates
	}

	let waypointCoordinates = [10, 1]
	let shipCoordinates = [0, 0]

	for (let instruction of data) {
		const [action, amount] = parseInstruction(instruction)
		const isShipInstruction = action === 'F'
		if (isShipInstruction) {
			shipCoordinates = moveShip(
				shipCoordinates,
				waypointCoordinates,
				amount
			)
		} else {
			switch (action) {
				case 'N':
					waypointCoordinates[1] += amount
					break;
				case 'E':
					waypointCoordinates[0] += amount
					break
				case 'S':
					waypointCoordinates[1] -= amount
					break
				case 'W':
					waypointCoordinates[0] -= amount
					break
				case 'R':
				case 'L':
					waypointCoordinates =
						rotateWaypoint(waypointCoordinates, [action, amount])
			}
		}

	}

	return Math.abs(shipCoordinates[0]) + Math.abs(shipCoordinates[1])
}
