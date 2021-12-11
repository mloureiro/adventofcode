export const validation = [262, 2698900776];

export const formatInput = input => input.split('\n').map(row => row.split(''));

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

export const part1 = data =>
	calculateTreesInPath(data, [3, 1])

export const part2 = data => {
	const paths = [
		[1, 1],
		[3, 1],
		[5, 1],
		[7, 1],
		[1, 2],
	]

	return paths
		.reduce((total, path) =>
			total * calculateTreesInPath(data, path), 1)
}
