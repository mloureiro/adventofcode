export const validation = [576];

export const formatInput = input => {
	const lines = input.split('\n');
	return [
		lines.pop(),
		lines.filter(Boolean).map(s => s.split(' => '))
	];
};

const executeReplacement = (molecule, match, replacement) => {
	let replacedList = [];
	let i = 0;
	for (let i = 0; i < molecule.length; i++) {
		if (match === molecule.slice(i, i + match.length))
			replacedList.push(
				molecule.slice(0, i)
				+ replacement
				+ molecule.slice(i + match.length)
			);
	}

	return replacedList;
}

export const part1 = ([molecule, replacements]) => {
	const unique = new Set();
	replacements.forEach(([match, replacement]) =>
		executeReplacement(molecule, match, replacement)
			.forEach(r => unique.add(r)));

	return unique.size;
};

const STARTER_MATCH = 'e';

export const part2 = ([target, replacements]) => {
	// TODO
	return null;
};
