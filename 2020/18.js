const fs = require('fs')
const data = fs.readFileSync('./18.txt')
	.toString()
	.trim()
	.split('\n')

const isNumber = value => !isNaN(value)
const isOperator = character => ['+', '-', '/', '*'].includes(character)
const isSumOperator = character => character === '+'

const calculateOperator = (left, operator, right) => {
	switch (operator) {
		case '+':
			return left + right
		case '-':
			return left - right
		case '*':
			return left * right
		case '/':
			return left / right
		default:
			throw Error(`Operation "${operator}" is not supported`)
	}
}

const parseInstructions = line => {
	const isOpenParenthesis = value => value === '('
	const isCloseParenthesis = value => value === ')'

	line = line.replace(/\s/g, '')
	const instructions = []
	for (
		let i = 0,
			currentNumber = '',
			openParenthesisPositions = [];
		i <= line.length;
		i++
	) {
		const char = line[i]

		if (isOpenParenthesis(char)) {
			openParenthesisPositions.push(i)
			continue
		}

		if (isCloseParenthesis(char)) {
			const start = openParenthesisPositions.pop() + 1
			if (openParenthesisPositions.length > 0) {
				continue
			}
			const end = i
			const instructionListSubset = line.substr(start, end - start)
			instructions.push(parseInstructions(instructionListSubset))
			continue
		}

		if (openParenthesisPositions.length > 0) {
			continue
		}

		if (isNumber(char)) {
			currentNumber += char
			continue
		}

		if (currentNumber.length) {
			instructions.push(parseInt(currentNumber, 10))
			currentNumber = ''
		}

		if (isOperator(char))
			instructions.push(char)
	}

	return instructions;
}

const firstChallenge = data => {
	const calculate = instructions => {
		let remainingInstructions = instructions
		let total = 0
		let operator = ''
		while (remainingInstructions.length > 0) {
			let currentInstruction = remainingInstructions.shift()

			if (Array.isArray(currentInstruction))
				currentInstruction = calculate(currentInstruction)


			if (isNumber(currentInstruction) && !operator)
				total = currentInstruction

			if (operator) {
				total = calculateOperator(total, operator, currentInstruction)
				operator = ''
			}

			if (isOperator(currentInstruction))
				operator = currentInstruction
		}

		return total
	}

	return data.reduce(
		(total, line) => total + calculate(parseInstructions(line)),
		0,
	)
}

const secondChallenge = data => {
	const calculate = instructions => {

		let remainingInstructions = instructions.reduce(
			(newInstructions, current, idx, self) => {
				if (Array.isArray(current))
					current = calculate(current)

				if (isSumOperator(current))
					return newInstructions

				const operator = idx > 0 && self[idx - 1]
				if (isSumOperator(operator)) {

					const previous = newInstructions.pop()

					return [
						...newInstructions,
						calculateOperator(previous, operator, current)
					]
				}

				return [...newInstructions, current]
			},
			[],
		)

		let total = 0
		let operator = ''
		while (remainingInstructions.length > 0) {
			let currentInstruction = remainingInstructions.shift()

			// at this stage there should be NO arrays
			// (aka operations within parenthesis)
			if (Array.isArray(currentInstruction))
				throw Error('Instruction is unexpected')

			if (isNumber(currentInstruction) && !operator)
				total = currentInstruction

			if (operator) {

				total = calculateOperator(total, operator, currentInstruction)
				operator = ''
			}

			if (isOperator(currentInstruction))
				operator = currentInstruction
		}

		return total
	}


	return data.reduce(
		(total, line) => total + calculate(parseInstructions(line)),
		0,
	)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
