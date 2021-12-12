export const validation = [1586300, 3737498];

export const formatInput = input =>
	input.split('\n').map(r => r.split('x').map(Number));

export const part1 = input => {
	return input.reduce((a, [l, w, h]) => {
		const sidesAreas = [l*w,  w*h,  h*l];
		return a + Math.min(...sidesAreas) + sidesAreas.reduce((a, s) => a + s * 2, 0)
	}, 0);
};

export const part2 = input => {
	return input.reduce((t, sides) => {
		const [a, b, c] = sides.sort((a, b) => a - b)
		return t
			+ a * 2 + b * 2 // wrap around the box
			+ a * b * c; // ribbon
	}, 0);
};
