import md5 from 'crypto-js/md5.js';

export const validation = [117946, 3938038];

export const formatInput = input => input;

const findNumber = (secret, initialValue) => {
	let i = 0;
	while (true) {
		if (md5(secret + i).toString().startsWith(initialValue))
			return i;
		i++;
	}
}

export const part1 = input => {
	return findNumber(input, '00000');
};

export const part2 = input => {
	return findNumber(input, '000000');
};
