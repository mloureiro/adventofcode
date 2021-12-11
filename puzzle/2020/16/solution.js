export const validation = [23036, 1909224687553];

export const formatInput = input => {
	const [rawRuleList, rawTicket, rawTickets] = input.split('\n\n').map(block => block.split('\n'))

	return {
		rules: parseRuleList(rawRuleList),
		ownTicket: parseTicket(rawTicket[1]),
		nearbyTickets: rawTickets.filter(line => !line.includes('ticket'))
			.map(parseTicket)
	}
}

const parseRuleList = list => list.map(
	(line, idx) => ({
		field: line.split(':')[0],
		position: idx,
		rangeList: line.split(':')[1]
			.split('or')
			.map(range => range.trim().split('-').map(x => parseInt(x, 10)))
	})
)

const parseTicket = rawTicket =>
	rawTicket.split(',').map(v => parseInt(v, 10))

export const part1 = input => {
	const mergeRangeList = rangeList =>
		rangeList.sort(([aMin], [bMin]) => aMin < bMin ? -1 : 1)
			.reduce(
				(mergedRanges, range) => {
					if (mergedRanges.length === 0)
						return [range]

					const [min, max] = range
					const [currentMin, currentMax] = mergedRanges.pop()


					if (currentMax + 1 < min)
						return [...mergedRanges, [currentMin, currentMax], range]

					if (max > currentMax)
						return [...mergedRanges, [currentMin, max]]

					return [...mergedRanges, [currentMin, currentMax]]
				},
				[],
			)

	const ruleRangeList = mergeRangeList(input.rules
		.reduce((list, rule) => [...list, ...rule.rangeList], []))

	return input.nearbyTickets
		.reduce((errorRate, ticket) =>
				errorRate + ticket.reduce(
					(errors, value) =>
						ruleRangeList
							.find(([min, max]) => min <= value && value <= max)
							? errors
							: errors + value,
					0,
				),
			0,
		)
}

export const part2 = input => {
	const removeInvalidTickets = (tickets, rules) =>
		tickets.filter(ticket =>
			ticket.every(value =>
				rules.find(([min, max]) => min <= value && value <= max)))

	const validTickets = removeInvalidTickets(
		input.nearbyTickets,
		[].concat(...input.rules.map(rule => rule.rangeList)),
	)

	let ruleMap = []
	for (let i = 0; i < input.rules.length; i ++) {
		const rules = input.rules[i].rangeList
		ruleMap[i] = []
		for (let j = 0; j < validTickets[0].length; j++) {
			let isRuleValidForPosition = true
			for (let k = 0; isRuleValidForPosition && k < validTickets.length; k++) {
				const current = validTickets[k][j]
				isRuleValidForPosition = rules.some(([min, max]) => min <= current && current <= max)
			}

			if (isRuleValidForPosition)
				ruleMap[i].push(j)
		}
	}

	const positions = Array(input.rules.length).fill(null)
	for (let i = 0; i < ruleMap.length; i++) {
		if (ruleMap[i].length === 1) {
			const nextPosition = ruleMap[i][0]
			positions[i] = nextPosition

			ruleMap = ruleMap.map(rule =>
				rule.filter(position => position !== nextPosition))

			i = -1
		}
	}

	return input.rules.filter(rule => rule.field.includes('departure'))
		.reduce((total, {position}) => total * input.ownTicket[positions[position]], 1)
}
