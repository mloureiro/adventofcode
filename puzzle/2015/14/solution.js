export const validation = [2640, 1102];

export const formatInput = input =>
	input.split('\n')
		.map(line => line.match(/^(\w+).*?(\d+).*?(\d+).*?(\d+)/).slice(1, 5))
		.map(([name, speed, flyTime, restTime]) => ({
			name,
			speed: parseInt(speed),
			flyTime: parseInt(flyTime),
			restTime: parseInt(restTime),
		}));

const STATES = {
	FLYING: 'FLYING',
	RESTING: 'RESTING',
};

export const part1 = (reindeers, totalSeconds = 2503) => {
	const sortNextReindeer = (a, b) => a.nextChangeIn - b.nextChangeIn;

	const state = reindeers.map(reindeer => ({
		...reindeer,
		state: STATES.RESTING,
		distance: 0,
		nextChangeIn: 0,
	}));

	let remainingTime = totalSeconds;
	while (remainingTime > 0) {
		const current = state[0];

		let elapsedTime = current.nextChangeIn;
		if (elapsedTime > remainingTime) {
			elapsedTime = remainingTime;
		}

		if (current.state === STATES.RESTING) {
			current.state = STATES.FLYING;
			current.nextChangeIn = current.flyTime;
		} else if (current.state === STATES.FLYING) {
			current.distance += current.speed * current.flyTime;
			current.state = STATES.RESTING;
			current.nextChangeIn = current.restTime;
		}

		Object.values(state).forEach(
			r => r.name !== current.name
				&& (r.nextChangeIn = r.nextChangeIn - elapsedTime));

		remainingTime -= elapsedTime;
		state.sort(sortNextReindeer);
	}

	// count reindeers caught in mid flying
	Object.values(state)
		.forEach(r => {
			if (r.state === STATES.FLYING)
				r.distance += r.speed * (r.flyTime - r.nextChangeIn);
		});

	return Math.max(...state.map(reindeer => reindeer.distance));
};

export const part2 = (reindeers, totalSeconds = 2503) => {
	const state = reindeers.map(reindeer => ({
		...reindeer,
		state: STATES.RESTING,
		points: 0,
		distance: 0,
		change: 0
	}));

	// TODO reduce the ammount of loops
	for (let i = 0; i < totalSeconds; i++) {
		state.forEach(reindeer => {
			if (reindeer.change === 0) {
				if (reindeer.state === STATES.RESTING) {
					reindeer.state = STATES.FLYING;
					reindeer.change = reindeer.flyTime;
				} else {
					reindeer.state = STATES.RESTING;
					reindeer.change = reindeer.restTime;
				}
			}

			reindeer.change--;
			if (reindeer.state === STATES.FLYING) {
				reindeer.distance += reindeer.speed;
			}
		});

		const winningDistance = Math.max(...state.map(reindeer => reindeer.distance));
		// increase points for reindeers that are in the lead
		state.forEach(reindeer => {
			if (reindeer.distance === winningDistance)
				reindeer.points++;
		});
	}

	return Math.max(...state.map(reindeer => reindeer.points));
};
