import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const getSessionCookie = () => process.env.SESSION_COOKIE;

const buildPath = (year, day, ...rest) =>
	['', year, 'day', day.replace(/^0/, ''), ...rest].join('/')

const buildAocUrl = path =>
	'https://adventofcode.com/' + path.replace(/^\//, '');

const fetchPage = path =>
	fetch(buildAocUrl(path), {
		headers: { Cookie: `session=${getSessionCookie()}` }
	})
		.then(response => {
			if (300 <= response.status || response.status < 200)
				throw Error(`Fetching '${path}' failed with a ${response.status} status`);

			return response;
		});


export const initClient = (year, day) => {

	return Object.freeze({
		url: buildAocUrl(buildPath(year, day)),
		fetchInput() {
			return fetchPage(buildPath(year, day, 'input'))
				.then(result => result.text())
		},
	});
};
