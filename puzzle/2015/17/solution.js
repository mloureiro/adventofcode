export const validation = [1638, 17];

export const formatInput = input =>
	input.split('\n').map(s => parseInt(s));

const calculatePossibleCombinations = (refrigerators, eggnogLiters, refrigeratorsInUse = []) => {
	if (eggnogLiters === 0) return [refrigeratorsInUse];
	if (eggnogLiters < 0) return false;

	return refrigerators.flatMap(
		(refrigerator, idx) => {
			return calculatePossibleCombinations(
				refrigerators.slice(idx + 1),
				eggnogLiters - refrigerator,
				[...refrigeratorsInUse, refrigerator]
			);
		},
		0,
	)
		.filter(Boolean);
}

export const part1 = (refrigerators, eggnogLiters = 150) => {
	refrigerators.sort((a, b) => a - b);
	return calculatePossibleCombinations(refrigerators, eggnogLiters).length;
};

export const part2 = (refrigerators, eggnogLiters = 150) => {
	const requiredBucketsCount = {};
	const [[, minimumBucketsPossibilities]] =
		calculatePossibleCombinations(refrigerators, eggnogLiters)
			.map(refrigeratorsInUse => refrigeratorsInUse.length)
			.reduce((map, count, idx, list) => {
				map[count] = (map[count] || 0) + 1;
				return idx + 1 === list.length
					? Object.entries(map).map(([c, t]) => [parseInt(c), t])
					: map;
			}, {})
			.sort(([a], [b]) => a - b);

	return minimumBucketsPossibilities;
};
