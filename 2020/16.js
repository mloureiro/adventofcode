const fs = require('fs')
const data = fs.readFileSync('./16.txt')
	.toString()
	.trim()
	.split('\n\n')
	.map(block => block.split('\n'))

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


const prepareInput = data => {
	const [rawRuleList, rawTicket, rawTickets] = data

	return {
		rules: parseRuleList(rawRuleList),
		ownTicket: parseTicket(rawTicket[1]),
		nearbyTickets: rawTickets.filter(line => !line.includes('ticket'))
			.map(parseTicket)
	}
}


const firstChallenge = data => {
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

	const input = prepareInput(data)
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

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
