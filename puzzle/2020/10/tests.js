const input1 = '16,10,15,5,1,11,7,19,6,12,4'.replace(/,/g, '\n');
const input2 = '28,33,18,42,31,14,46,20,48,47,24,23,49,45,19,38,39,11,1,32,25,35,8,17,7,9,4,2,34,10,3'.replace(/,/g, '\n');

export const tests = [
	{ part: 1, input: input1, result: 35 },
	{ part: 1, input: input2, result: 220 },
	{ part: 2, input: input1, result: 8 },
	{ part: 2, input: input2, result: 19208 },
];
