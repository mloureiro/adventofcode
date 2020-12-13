const fs = require('fs')
const data = fs.readFileSync('./10.txt')
	.toString()
	.split('\n')
	.filter(Boolean)
	.map(row => parseInt(row, 10))
	.sort((a, b) => a < b ? -1 : 1)

// add edges
data.unshift(0)
data.push(data[data.length - 1] + 3)

const firstChallenge = data => {
	let single = 0
	let triple = 0
	for (let i = 1; i < data.length; i++) {
		const diff = data[i] - data[i -1]
		if (diff === 1)
			single++
		else if (diff === 3)
			triple++
		else
			throw Error(`Difference "${diff}" is not allowed`)
	}

	return single * triple
}

const secondChallenge = data => {
	const buildConnectionMap = list => {
		const nodes = {}
		nodes[list[0]] = []
		for (let i = 1; i < list.length; i++) {
			nodes[list[i]] = []
			for (let j = 1; j <= 3 && i - j >= 0 && list[i] - list[i - j] <= 3; j++)
				nodes[list[i]].push(list[i - j])
		}

		return nodes
	}


	const countPathsRecursive = nodes => {
		const pathsTillNode = {}
		return Object.keys(nodes)
			.reduce((total, node) => {
				const connections = nodes[node]

				let paths = 0
				if (connections.length === 0) {
					paths = 1
				} else {
					for (const previousNode of connections)
						paths += pathsTillNode[previousNode]
				}

				pathsTillNode[node] = paths

				return paths
			}, 0)
	}

	const nodes = buildConnectionMap(data)
	//console.log(nodes)

	return countPathsRecursive(nodes)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
