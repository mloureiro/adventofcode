const fs = require('fs')
const data = fs.readFileSync('./14.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

const firstChallenge = data => {
	const isMask = line =>
		line.indexOf('mask') !== -1

	const parseMask = line =>
		(line.split('=')[1]).trim()

	const parseMemoryAssignment = line =>
		line.split('=')
			.reduce((instruction, value) => {
				return [
					parseInt(instruction.match(/\[(\d+)\]/)[1], 10),
					parseInt(value.trim(), 10),
				]
			})

	const buildInstructions = program => {
		const memoryPointers = {}
		let currentMask = ''
		for (let row of data) {
			console.group('Parsing instruction:', row)
			if (isMask(row)) {
				currentMask = parseMask(row)
				console.log('New mask:', currentMask)
			} else {
				const [position, value] = parseMemoryAssignment(row)
				console.log('New Instruction:', `[${position}, ${value}]`)

				memoryPointers[position] = [currentMask, value]
			}

			console.groupEnd()
		}

		return Object.values(memoryPointers)
	}

	const toBinary = number => {
		let binary = '';
		if (number < 0)
			number = number >>> 0;

		while(Math.ceil(number/2) > 0) {
			binary = number%2 + binary;
			number = Math.floor(number/2);
		}

		return binary;

	}

	const applyMask = (binary, mask) => {
		const finalBinaryArray = mask.split('')
		let i = finalBinaryArray.length - 1;
		for (let i = binary.length - 1; i >= 0; i--) {
			const position = finalBinaryArray.length - (binary.length - i)
			if (finalBinaryArray[position] === 'X')
				finalBinaryArray[position] = binary[i]
		}

		return finalBinaryArray.join('').replace(/X/g, '0')
	}

	const toDecimal = binary =>
		parseInt(binary, 2)

	const instructions = buildInstructions(data)

	return instructions.reduce(
		(total, [mask, value]) =>
			total + toDecimal(applyMask(toBinary(value), mask)),
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
