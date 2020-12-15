const fs = require('fs')
const data = fs.readFileSync('./14.txt')
	.toString()
	.trim()
	.split('\n')

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
			if (isMask(row)) {
				currentMask = parseMask(row)
			} else {
				const [position, value] = parseMemoryAssignment(row)

				memoryPointers[position] = [currentMask, value]
			}
		}

		return Object.values(memoryPointers)
	}

	const toBinary = number => {
		let binary = '';
		if (number < 0)
			number = number >>> 0;

		while (Math.ceil(number / 2) > 0) {
			binary = number % 2 + binary;
			number = Math.floor(number / 2);
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
	const instructions = data.map(line => {
		if (line.includes('mask'))
			return {
				type: 'mask',
				value: line.replace(/^mask = /, '')
			}

		const [, address, value] = line.match(/^mem\[(\d+)\] = (\d+)$/)
		return {
			type: 'write',
			address: parseInt(address, 10),
			value: parseInt(value, 10),
		}
	})

	const applyMask = (address, mask) => {
		let addressClone = address.split('')
		for (let i = 0; i < mask.length; i++)
			if (mask[i] === '1' || mask[i] === 'X')
				addressClone[i] = mask[i]

		return addressClone.join('')
	}

	const replaceAtPosition = (string, position, replacement) =>
		`${string.slice(0, position)}${replacement}${string.slice(position + 1)}`

	const buildFloatingVariations = (addressList) => {
		const newList = []
		let isChanged = false
		for (let address of addressList) {
			const xPosition = address.indexOf('X')
			if (xPosition > -1) {
				newList.push(
					replaceAtPosition(address, xPosition, '0'),
					replaceAtPosition(address, xPosition, '1'),
				);
				isChanged = true
			}
		}

		if (!isChanged)
			return addressList

		return buildFloatingVariations(newList)
	}

	const input = instructions.map(instruction => {
		let {type, address} = instruction

		if (type !== 'write')
			return instruction

		const binaryAddress = address.toString(2)
			.padStart(36, '0')

		return {
			...instruction,
			address: binaryAddress,
		}
	})

	let memory = {}
	let currentMask = '';
	for (let line of input) {
		const {type, address, value} = line

		if (type === 'mask') {
			currentMask = value
			continue
		}

		const maskedAddress = applyMask(address, currentMask)

		const addressList = buildFloatingVariations([maskedAddress])
			.map(a => parseInt(a, 2))

		for (let address of addressList)
			memory[address] = value
	}

	return Object.values(memory).reduce((t, v) => t + v)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
