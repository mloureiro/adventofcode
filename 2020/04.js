const fs = require('fs')
const data = fs.readFileSync('./04.txt')
	.toString()
	.split('\n')

// this does way too much, but it is to make less iterations
const parseValidateAndCountDocuments = (data, isDocumentValid) =>
	data.reduce(
		([total, currentDocument], line) => {
			if (line === '')
				return [total + (isDocumentValid(currentDocument) ? 1 : 0), {}]

			line.split(' ')
				.map(entry => entry.split(':'))
				.forEach(([key, value]) => (currentDocument[key] = value))

			return [total, currentDocument]
		},
		[0, {}],
	)[0]

const firstChallenge = data => {
	const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
	const isDocumentValid = document =>
		REQUIRED_FIELDS.every(field => Boolean(document[field]))

	return parseValidateAndCountDocuments(data, isDocumentValid)
}

const secondChallenge = data => {
	const isStringNumber = str => !isNaN(str)
	const isNumberBetween = (str, min, max) => {
		const num = parseInt(str, 10)

		return isStringNumber(str) && min <= num && num <= max
	}

	const REQUIRED_FIELDS_VALIDATION = {
		byr: v => isNumberBetween(v, 1920, 2002),
		iyr: v => isNumberBetween(v, 2010, 2020),
		eyr: v => isNumberBetween(v, 2020, 2030),
		hgt: v => {
			const [, height, unit] = (v && v.match(/^(\d+)(in|cm)$/)) || []

			return Boolean(height && unit && (
				(unit === 'cm' &&  isNumberBetween(height, 150, 193))
				|| (unit === 'in' && isNumberBetween(height, 59, 76))
			))
		},
		hcl: v => v && /^#[\da-f]{6}$/i.test(v),
		ecl: v => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v),
		pid: v => v && /^\d{9}$/.test(v),
	}

	const isDocumentValid = document =>
		Object.keys(REQUIRED_FIELDS_VALIDATION)
			.every(field => REQUIRED_FIELDS_VALIDATION[field](document[field]))


	return parseValidateAndCountDocuments(data, isDocumentValid)
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
