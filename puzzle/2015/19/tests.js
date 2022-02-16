const electrons = `
e => H
e => O
`.trim();

const inputTemplate = `
H => HO
H => OH
O => HH
`.trim()

const buildInput = (result, hasElectrons = false) => {
	const template = (inputTemplate + `\n\n` + result);
	return hasElectrons
		? electrons + '\n' + template
		: template;
};

export const tests = [
	// { part: 1, result: 4, input: buildInput('HOH') },
	// { part: 1, result: 7, input: buildInput('HOHOHO') },
	{ part: 2, result: 4, input: buildInput('HOH', true) },
	// { part: 2, result: 7, input: buildInput('HOHOHO', true) },
];
