export const validation = [259, 210612924879242];

export const formatInput = input => input.split('\n').filter(Boolean);

export const part1 = data => {
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

// TODO make my own 🙃
// shamelessly copied from @imbadatreading
// src: https://www.reddit.com/r/adventofcode/comments/kc4njx/2020_day_13_solutions/gfth69h/
export const part2 = data => {
	const busTimes = data[1].split(',')
		.reduce((list, value, idx) =>
				value !== 'x'
					? [...list, [parseInt(value, 10), idx]]
					: list,
			[],
		)

	let lcm = 1
	let time = 0
	for (let i = 0; i < busTimes.length - 1; i ++) {
		const [currentBusId] = busTimes[i]
		const [nextBusId, nextIndex] = busTimes[i + 1]

		lcm *= currentBusId

		while ((time + nextIndex) % nextBusId !== 0)
			time += lcm
	}

	return time
}
