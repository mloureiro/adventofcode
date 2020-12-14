const fs = require('fs')
const data = fs.readFileSync('./13-e1.txt')
	.toString()
	.split('\n')
	.filter(Boolean)


const firstChallenge = data => {
	const calculateEarliestDeparture = (busId, earliestTimestamp) =>
		(Math.floor(earliestTimestamp / busId) + 1) * busId

	const parseSchedule = schedule => [
		parseInt(schedule[0], 10),
		schedule[1].split(',')
			.filter(id => id !== 'x')
			.map(id => parseInt(id, 10))
	]

	const [earliestTimestamp, busIds] = parseSchedule(data)
	const earliestPossibleBusId = busIds
		.reduce(
			(earliest, bus) => {
				if (earliest === null)
					return bus

				const earliestBusDeparture = calculateEarliestDeparture(bus, earliestTimestamp)
				const earliestDeparture = calculateEarliestDeparture(earliest, earliestTimestamp)

				return earliestDeparture > earliestBusDeparture
					? bus
					: earliest
			},
			null,
		)
	const earliestPossibleBusDeparture = calculateEarliestDeparture(earliestPossibleBusId, earliestTimestamp)

	return (earliestPossibleBusDeparture - earliestTimestamp) * earliestPossibleBusId
}

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)

