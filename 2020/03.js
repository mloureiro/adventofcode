const fs = require('fs')
const data = fs.readFileSync('./03.txt')
	.toString()
	.split('\n')
	.filter(Boolean)
	.map(row => row.split(''))

const TREE = '#'

const calculateTreesInPath = (map, [right, down]) => {

	let currentPosition = [0, 0]
	let totalTreesFound = 0
	let hasReachedBottomRight = false
	while (!hasReachedBottomRight) {
		let [x, y] = currentPosition
		x += right
		y += down

		hasReachedBottomRight = y >= map.length
		if (hasReachedBottomRight)
			return totalTreesFound

		if (x >= map[y].length)
			x -= map[y].length

		const isTree = map[y][x] === TREE
		if (isTree)
			totalTreesFound++

		currentPosition = [x, y]
	}

	return totalTreesFound
}

const firstChallenge = data =>
	calculateTreesInPath(data, [3, 1])

const secondChallenge = data => {
	return null
}


console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
