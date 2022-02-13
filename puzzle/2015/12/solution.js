export const validation = [111754, 65402];

export const formatInput = input => JSON.parse(input);

export const part1 = input => {
	const calcRec = val => {
		if (Number.isInteger(val))
			return val;
		if (typeof val === 'string')
			return 0;

		val = Array.isArray(val) ? val : Object.values(val);

		return val.reduce((acc, cur) => acc + calcRec(cur), 0);
	}

	return calcRec(input);
};

export const part2 = input => {
	const calcRec = val => {
		const isRedZeroing = !Array.isArray(val);
		const list = Array.isArray(val) ? val : Object.values(val);
		let sum = 0;
		for (let element of list) {
			// console.log('>', element, element === 'red', isRedZeroing);
			if (element === 'red' && isRedZeroing) {
				// console.log('>', element, val);
				return 0;
			} else if (Number.isInteger(element)) {
				sum += element;
			} else if (typeof element === 'object') {
				sum += calcRec(element);
			}
		}

		return sum;
	}

	// 38885
	return calcRec(input);
};
