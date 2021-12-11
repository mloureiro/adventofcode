export const validation = [375482, 1689540415957];

export const formatInput = input => input.split(',').map(Number);

const calculateSchoolSizeInXDays = (days, initialState) => {
	const school = Array(9).fill(0)
	initialState.forEach(fish => school[fish]++)

	for (let d = 0; d < days; d++) {
		let previous = 0
		for (let i = school.length - 1; i >= 0; i--) {
			let tmp = school[i]
			school[i] = previous
			previous = tmp
		}

		school[6] += previous
		school[8] += previous
	}


	return school.reduce((a, v) => a + v, 0)
}

export const part1 = data => calculateSchoolSizeInXDays(80, data)

export const part2 = data => calculateSchoolSizeInXDays(256, data)
