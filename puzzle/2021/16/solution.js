export const validation = [883, 1675198555015];

export const formatInput = input => input;

const binToInt = bin => parseInt(bin, 2);
const hexToBin = hex => hex.split('')
	.map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');

const binParser = bin => {
	let i = 0;
	return {
		parse(length) {
			i += length;
			return binToInt(bin.slice(i - length, i));
		},
		rest() {
			return bin.slice(i, bin.length);
		},
	};
};

const parseLiteralValue = string => {
	let remaining = string;
	const chunks = [];
	let curr = '';
	do {
		curr = remaining.slice(0, 5)
		remaining = remaining.slice(5, remaining.length);
		chunks.push(curr);
	} while(curr[0] !== '0');

	return [
		remaining,
		binToInt(chunks.map(bin => bin.slice(1, bin.length)).join('')),
	];
};

const PACKET_TYPE = {
	sum: 0, // sum
	prd: 1, // product *
	min: 2, // minimum
	max: 3, // maximum
	ltr: 4, // literal
	grt: 5, // greater than
	lst: 6, // lesser than
	eql: 7, // equal to
}
const BIT_I_TYPES = {
	subPackagesCount: 1,
	subPackagesLength: 0,
};

const parseBinToPackets = (initialBin, maxIterations = Infinity) => {
	const packets = [];
	let remaining = initialBin;
	let i = -1;
	while (remaining.length >= 6 && Number(remaining) !== 0 && ++i < maxIterations) {
		const bin = binParser(remaining);
		let packet = {
			version: bin.parse(3),
			type: bin.parse(3),
		}

		// literal value
		if (packet.type === PACKET_TYPE.ltr) {
			[remaining, packet.value] = parseLiteralValue(bin.rest())
		} else { // operator
			packet.i = bin.parse(1);
			packet.length = packet.i === BIT_I_TYPES.subPackagesCount ? 11 : 15;
			packet.subPackages = bin.parse(packet.length);

			if (packet.i === BIT_I_TYPES.subPackagesCount) {
				[packet.children, remaining] =
					parseBinToPackets(bin.rest(), packet.subPackages);
			} else {
				[packet.children] = parseBinToPackets(bin.rest().slice(0, packet.subPackages));
				remaining = bin.rest().slice(packet.subPackages, bin.rest().length);
			}
		}

		packets.push(packet)
	}

	return [packets, remaining];
}

export const part1 = input => {
	const countRec = packet =>
		packet.version + (packet.children || []).reduce((a, p) => a + countRec(p), 0);

	const bin = hexToBin(input);
	return countRec(parseBinToPackets(bin)[0][0]);
};

export const part2 = input => {
	const executeRec = packet => {
		return ({
			[PACKET_TYPE.sum]: () =>
				packet.children.reduce((acc, curr) => acc + executeRec(curr), 0),
			[PACKET_TYPE.prd]: () =>
				packet.children.reduce((acc, curr) => {
					return acc * executeRec(curr);
				}, 1),
			[PACKET_TYPE.min]: () =>
				packet.children.reduce((min, curr) => {
					const childrenValue = executeRec(curr);
					return min < childrenValue ? min : childrenValue;
				}, Infinity),
			[PACKET_TYPE.max]: () =>
				packet.children.reduce((max, curr) => {
					const childrenValue = executeRec(curr);
					return max > childrenValue ? max : childrenValue;
				}, -Infinity),
			[PACKET_TYPE.ltr]: () => packet.value,
			[PACKET_TYPE.grt]: () => {
				const [a, b, ...rest] = packet.children;
				if (rest.length)
					throw Error(`Operation "grt" should only have 2 children instead it has "${packet.children.length}"`)

				return executeRec(a) > executeRec(b) ? 1 : 0;
			},
			[PACKET_TYPE.lst]: () => {
				const [a, b, ...rest] = packet.children;
				if (rest.length)
					throw Error(`Operation "lst" should only have 2 children instead it has "${packet.children.length}"`)

				return executeRec(a) < executeRec(b) ? 1 : 0;
			}, //
			[PACKET_TYPE.eql]: () => {
				const [a, b, ...rest] = packet.children;
				if (rest.length)
					throw Error(`Operation "eql" should only have 2 children instead it has "${packet.children.length}"`)

				return executeRec(a) === executeRec(b) ? 1 : 0;
			},
		})[packet.type]();
	}

	const bin = hexToBin(input);
	return executeRec(parseBinToPackets(bin)[0][0]);
};
