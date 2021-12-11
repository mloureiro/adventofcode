export const validation = [572, 306];

export const formatInput = input => input.split('\n');

const parseEntry = entry => {
	const [, min, max, char, pass] = /^(\d+)-(\d+) ([a-z\d]*): (.*)$/i.exec(entry)

	return { min, max, char, pass }
}

export const part1 = data => {
	let validEntries = 0
	for (let entry of data) {
		const { min, max, char, pass } = parseEntry(entry)

		const filtered = pass.replace(RegExp(`[^${char}]`, 'g'), '')
		const total = filtered.length

		if (min <= total && total <= max)
			validEntries++
	}

	return validEntries
}

export const part2 = data => {
	let validEntries = 0
	for (let entry of data) {
		const { min, max, char, pass } = parseEntry(entry)

		const first = pass[min - 1]
		const last = pass[max - 1]

		if (first === char && last !== char
			|| first !== char && last === char)
			validEntries++
	}

	return validEntries
}
