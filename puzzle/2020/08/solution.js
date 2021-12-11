export const formatInput = input => input.split('\n');

const parseInstructions = rawInstruction => {
	try {
		const [instruction, value] = rawInstruction.split(' ')

		return [instruction, parseInt(value, 10)]
	} catch (e) {
		console.error(`Fail to parse: "${rawInstruction}"`)
		throw e
	}
}

export const part1 = data => {
	let instructionsVisited = {}
	let accumulator = 0
	let hasFinished = false
	let i = 0
	while (!hasFinished) {
		if (instructionsVisited[i])
			return accumulator
		else
			instructionsVisited[i] = true

		const [action, value] = parseInstructions(data[i])
		switch (action) {
			case 'jmp':
				i += value
				break
			case 'acc':
				accumulator += value
			case 'nop':
			default:
				i++
		}
	}

	return accumulator
}

export const part2 = data => {
	const interpretInstruction = instruction => {
		const [action, value] = parseInstructions(instruction)
		switch (action) {
			case 'jmp':
				return [value, 0]
			case 'acc':
				return [1, value]
			case 'nop':
				return [1, 0]
			default:
				throw Error(`Instruction "${instruction}" is invalid`)
		}
	}

	const isInstructionSwappable = instruction =>
		['jmp', 'nop'].includes(parseInstructions(instruction)[0])

	const swapInstruction = instruction => {
		const [action, value] = parseInstructions(instruction)
		switch (action) {
			case 'jmp': return `nop ${value}`
			case 'nop': return `jmp ${value}`
			default:
				throw Error(`Instruction "${instruction}" not swappable`)
		}
	}

	let visited = {}
	let accumulator = 0
	let position = 0
	let history = []
	let lastUnchangedPosition = null
	while (position < data.length) {
		let instruction = data[position]

		if (visited[position]) {
			if (lastUnchangedPosition)
				history.splice(lastUnchangedPosition + 1, history.length - lastUnchangedPosition)

			let foundBrokenInstruction = false
			while (!foundBrokenInstruction) {
				let currentInstruction
				do {
					const [prevPosition, prevAccumulator, prevInstruction, prevVisited] = history.pop()
					position = prevPosition
					accumulator = prevAccumulator
					currentInstruction = prevInstruction
					visited = prevVisited
				} while (!isInstructionSwappable(currentInstruction))

				instruction = swapInstruction(currentInstruction)
				const [prevPosition] = interpretInstruction(instruction)

				foundBrokenInstruction = visited[prevPosition]
			}

			lastUnchangedPosition = history.length - 1
		}

		visited[position] = true
		history.push([position, accumulator, instruction, { ...visited }])
		const [addPosition, addAccumulator] = interpretInstruction(instruction)
		accumulator += addAccumulator
		position += addPosition
	}

	return accumulator
}
