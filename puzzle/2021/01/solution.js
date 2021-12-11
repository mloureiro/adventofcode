export const validation = [1616, 1645];

export const formatInput = input => input.split('\n').map(Number);

export const part1 = d =>
	d.reduce((a, c, i) => i !== 0 && c > d[i - 1] ? a+1 : a, 0);

export const part2 = d =>
	part1(d.map((c, i) => i+2 > d.length ? null : d[i] + d[i+1] + d[i+2]).slice(0,-2));
