export const validation = [7120, 3570];

export const formatInput = input => input.split('\n');

// TODO fix it (not working currently 🤔)
export const part1 = data =>
	data.reduce(
		([total, group], answers) => {
			if (!answers)
				return [total + Object.keys(group).length, {}]

			answers.split('')
				.forEach(answer => group[answer] = true)

			return [total, group]
		},
		[0, {}],
	)[0]

export const part2 = data =>
	data.reduce(
		([total, groupSize, group], answers) => {
			if (!answers) {
				const completeGroupAnswerTotal = Object.keys(group)
					.reduce((total, key) =>
						group[key] === groupSize ? total + 1 : total, 0)

				return [total + completeGroupAnswerTotal, 0, {}]
			}

			answers.split('')
				.forEach(answer => group[answer] = (group[answer] || 0) + 1)

			return [total, groupSize + 1, group]
		},
		[0, 0, {}],
	)[0]
