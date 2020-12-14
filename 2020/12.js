const fs = require('fs')
const data = fs.readFileSync('./12.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

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

const firstChallenge = data => {
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

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
