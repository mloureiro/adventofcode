export const tests = [
	{ part: 1, result: 0, input: '[]' },
	{ part: 1, result: 0, input: '{"a":"red"}' },
	{ part: 1, result: 6, input: '[1,2,3]' },
	{ part: 1, result: 6, input: '{"a":2,"b":4}' },
	{ part: 1, result: 12, input: '{"a":2,"b":4, "c": [1,2,3]}' },
	{ part: 1, result: 0, input: '[1, -1]' },
	{ part: 1, result: 4, input: '[1,"red",3]' },
	{ part: 1, result: 0, input: '["yellow","red"]' },
	{ part: 2, result: 6, input: '[1,2,3]' },
	{ part: 2, result: 4, input: '[1,{"c":"red","b":2},3]' },
	{ part: 2, result: 0, input: '{"d":"red","e":[1,2,3,4],"f":5}' },
	{ part: 2, result: 6, input: '[1,"red",5]' },
];
