const fs = require('fs')
const data = fs.readFileSync('./05.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

const calculateSeatId = (col, row) => col * 8 + row
const hashToBinary = hash => hash.replace(/[BR]/gi, '1').replace(/[FL]/gi, '0')
const binToDec = bin => parseInt(bin, 2)
const decomposeSeat = hash => {
	const row = hash.slice(0, -3)
	const col = hash.slice(-3, hash.length)

	return [row, col]
}

const firstChallenge = data =>
	data.reduce(
		(max, hash) => {
			const id = calculateSeatId(
				...decomposeSeat(
					hashToBinary(hash)
				).map(binToDec)
			)

			return id > max ? id : max
		},
		0,
	)

const secondChallenge = data => {
	const keyMap = data.reduce((keyMap, hash) => {
		const bin = hashToBinary(hash)
		keyMap[binToDec(bin)] = hash

		return keyMap
	}, {})

	const seatKey = Object.keys(keyMap)
		.find(key => {
			const int = parseInt(key, 10)

			return Boolean(!keyMap[int + 1])
		})

	const [row, col] = decomposeSeat(hashToBinary(keyMap[seatKey]))
		.map(binToDec)

	return calculateSeatId(row, col + 1)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
