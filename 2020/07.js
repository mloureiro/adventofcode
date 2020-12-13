const fs = require('fs')
const data = fs.readFileSync('./07.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

const MY_BAG_COLOR = 'shiny gold'

const decomposeRule = rule => {
	const [outer, inner] = rule.split('contain')
	const outerColor = outer.replace(/bags?/, '').trim()
	const innerColorList = inner.split(',')
		.map(colorRule => {
			try {
				const [, total, colorName] = colorRule.match(/(\d+) (.*) bags?/)

				return {name: colorName, total: parseInt(total, 10)}
			} catch (e) {
				return null
			}
		})
		.filter(Boolean)

	return [outerColor, innerColorList]
}

const firstChallenge = data => {
	const buildColorMap = ruleList => ruleList.reduce(
		(colorMap, rule) => {
			const [outer, innerList] = decomposeRule(rule)

			if (!innerList)
				return colorMap

			innerList.forEach(color => {
				if (!color)
					return

				if (!colorMap[color.name])
					colorMap[color.name] = []

				colorMap[color.name].push(outer)
			})

			return colorMap
		},
		{},
	)

	const colorMap = buildColorMap(data)

	const recursiveCount = (map, missingColors, countedColors) => {
		if (missingColors.length === 0)
			return 0

		const [currentColor, ...remainingColors] = missingColors

		if (countedColors.includes(currentColor))
			return recursiveCount(map, remainingColors, countedColors)

		return 1 + recursiveCount(
			map,
			[
				...remainingColors,
				...(map[currentColor] || [])
			],
			[...countedColors, currentColor],
		)
	}

	return recursiveCount(colorMap, colorMap[MY_BAG_COLOR], [])
}

const secondChallenge = data => {
	const buildColorMap = ruleList => ruleList.reduce(
		(colorMap, rule) => {
			const [outer, innerList] = decomposeRule(rule)

			colorMap[outer] = innerList

			return colorMap
		},
		{},
	)

	const recursiveCount = (map, currentColor) => {
		const innerList = map[currentColor]

		if (innerList === 0)
			// 0 because we're already counting the value in the reduce (colorTotal + ...)
			return 0

		return innerList.reduce(
			(total, { name: colorName, total: colorTotal }) =>
				total + colorTotal + colorTotal * recursiveCount(map, colorName),
			0,
		)
	}

	const colorMap = buildColorMap(data)

	return recursiveCount(colorMap, MY_BAG_COLOR)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
