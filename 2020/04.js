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
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
