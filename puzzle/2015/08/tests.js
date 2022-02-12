const input = `
""
"abc"
"aaa\\"aaa"
"\\x27"
`.trim();

export const tests = [
	{ part: 1, result: 2, input: '"1"' }, 					// "1"
	{ part: 1, result: 2, input: '"a"' },						// "a"
	{ part: 1, result: 3, input: '"\\\\"' },				// "\\"
	{ part: 1, result: 3, input: '"\\""' },					// "\""
	{ part: 1, result: 5, input: '"\\x1A"' },				// "\x1A"
	{ part: 1, result: 2, input: '"a1"' },					// "a1"
	{ part: 1, result: 3, input: '"a\\\\1"' },			// "a\\1"
	{ part: 1, result: 3, input: '"a\\\\"1"' },			// "a\\"1"
	{ part: 1, result: 5, input: '"a\\x2F1"' },			// "a\x2F1"
	{ part: 1, result: 4, input: '"\\\\\\\\"' },		// "\\\\"
	{ part: 1, result: 5, input: '"\\"\\\\\\""' },	// "\"\\\""
	{ part: 1, result: 12, input },
	{ part: 2, result: 4, input: '"1"' }, 					// "1" -> "\"1\""
	{ part: 2, result: 4, input: '"a"' },						// "a" -> "\"a\""
	{ part: 2, result: 6, input: '"\\\\"' },				// "\\" -> "\"\\\\\""
	{ part: 2, result: 6, input: '"\\""' },					// "\"" -> "\"\\\"\""
	{ part: 2, result: 5, input: '"\\x1A"' },				// "\x1A" -> "\"\\x1A\""
	{ part: 2, result: 4, input: '"a1"' },					// "a1" -> "\"a1\""
	{ part: 2, result: 6, input: '"a\\\\1"' },			// "a\\1" -> "\"a\\\\1\""
	{ part: 2, result: 7, input: '"a\\\\"1"' },			// "a\\"1" -> "\"a\\\\\\"1\""
	{ part: 2, result: 5, input: '"a\\x2F1"' },			// "a\x2F1" -> "\"a\\x2F1\""
	{ part: 2, result: 8, input: '"\\\\\\\\"' },		// "\\\\" -> "\"\\\\\\\\\""
	{ part: 2, result: 10, input: '"\\"\\\\\\""' },	// "\"\\\"" -> "\"\\\"\\\\\\"\""
	{ part: 2, result: 19, input },
];
