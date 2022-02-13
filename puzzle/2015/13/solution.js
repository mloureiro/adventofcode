export const validation = [709, 668];

export const formatInput = input =>
	input.split('\n')
		.map(line => line
			.match(/^(\w+).*(gain|lose)\s(\d+).*\s(\w+)\.$/)
			.slice(1, 5));

const calculatePermutations = list => {
	if (list.length === 1) {
		return [list];
	}
	const result = [];
	for (let i = 0; i < list.length; i++) {
		const head = list[i];
		const tail = list.slice(0, i).concat(list.slice(i + 1));
		const permutations = calculatePermutations(tail);
		permutations.forEach(permutation => {
			result.push([head].concat(permutation));
		});
	}
	return result;
};

const inputToMap = input => {
	const map = {};
	input.forEach(line => {
		const [from, sign, amount, to] = line;
		map[from] = map[from] || {};
		map[from][to] = (sign === 'gain' ? 1 : -1) * parseInt(amount);
	});
	return map;
};

const calculateHappyness = (seats, map) => {
	let happyness = 0;
	seats.forEach((person, idx) => {
		let next = idx + 1;
		let prev = idx - 1;
		if (idx === 0) {
			prev = seats.length - 1;
		} else if (idx === seats.length - 1) {
			next = 0
		}
		happyness += map[person][seats[prev]];
		happyness += map[person][seats[next]];
	});
	return happyness;
}

const calculateHigestHappyness = map => {
	// because the table is round, we can calculate the permutations 
	// of all the people in the table but the 1st one and add it after
	const [head, ...rest] = Object.keys(map);
	const seatOrders = calculatePermutations(rest)
		.map(order => [head, ...order]);

	return Math.max(...seatOrders
		.map(order => calculateHappyness(order, map)));
}

export const part1 = input =>
	calculateHigestHappyness(inputToMap(input));

const addMe = map => {
	const me = 'Me';
	map[me] = {};
	Object.keys(map).forEach(person => {
		map[me][person] = 0;
		map[person][me] = 0;
	});
	return map;
}

export const part2 = input =>
	calculateHigestHappyness(addMe(inputToMap(input)));
