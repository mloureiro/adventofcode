export const formatInput = input => input.split('\n');

const calculateSeatId = (col, row) => col * 8 + row
const hashToBinary = hash => hash.replace(/[BR]/gi, '1').replace(/[FL]/gi, '0')
const binToDec = bin => parseInt(bin, 2)
const decomposeSeat = hash => {
	const row = hash.slice(0, -3)
	const col = hash.slice(-3, hash.length)

	return [row, col]
}

export const part1 = data =>
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

export const part2 = data => {
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
