const fs = require('fs')
const data = fs.readFileSync('./15.txt')
	.toString()
	.split('\n')
	.filter(Boolean)
	.map(string => parseInt(string, 10))

const calculateValueInIteration = (data, iteration) => {
	const calculatePosition = (position, {previousPosition}) => ({
		difference: previousPosition
			? position - previousPosition
			: null,
		previousPosition: position
	})

	const map = {}

	for (let i = 0; i < data.length; i++)
		map[data[i]] = calculatePosition(i + 1, map[data[i]] || {})

	const lastElement = data[data.length - 1]
	let currentNumber = lastElement.difference || 0
	let previousNumber = null
	for (let i = data.length; i < iteration; i++) {

		map[currentNumber] = calculatePosition(i + 1, map[currentNumber] || {})
		previousNumber = currentNumber
		currentNumber = map[currentNumber].difference || 0
	}

	return previousNumber
}

const firstChallenge = data => {
	return calculateValueInIteration(data, 2020)
}

const secondChallenge = data => {
	return calculateValueInIteration(data, 30000000)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
