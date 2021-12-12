/*
    start
    /   \
c--A-----b--d
    \   /
     end
 */
const input1 = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`.trim();

const input2 = `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`.trim();

const input3 = `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`.trim();

export const tests = [
	{ part: 1, input: input1, result: 10 },
	{ part: 1, input: input2, result: 19 },
	{ part: 1, input: input3, result: 226 },
	{ part: 2, input: input1, result: 36 },
	{ part: 2, input: input2, result: 103 },
	{ part: 2, input: input3, result: 3509 },
];
