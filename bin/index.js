#!/usr/bin/env node

import { copyFile, mkdir, readdir, readFile, stat, writeFile} from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import { initClient } from '../lib/client.js';

const template = {
	directory: 'puzzle-template',
	solution: 'solution.js',
	input: 'input',
	tests: 'tests.js',
};

const program = new Command();

program
	.command('run <year> <day>')
	.description('Run Advent of Code puzzles')
	.option('-w, --watch', 'run puzzle on every change', false)
	.option('-t, --test', 'run tests instead of input', false)
	.option('-v, --validate', 'validate puzzle against test and expected results', false)
	.option('-d, --debug', 'show full errors output', false)
	.action(async (year, day, options) =>
		handleErrors(() => runPuzzle(year, day, options), options.debug));

program
	.command('init <year> <day>')
	.description('Scaffold a new puzzle')
	.option('-f, --force', 'force scaffold to happen', false)
	.option('-d, --debug', 'show full errors output', false)
	.action(async (year, day, options) =>
		handleErrors(() => scaffold(year, day, options), options.debug));

const scaffold = async (year, day, { force }) => {
	const files = await readdir(makePathFromScript(template.directory));
	// ensure template directory exists and has the expected files
	const missingFiles = Object.values(template)
		.filter(file => file !== template.directory && !files.includes(file));
	if (missingFiles.length)
		throw Error(`Files "${missingFiles.join('", "')}" are missing from template directory.`);

	const aocClient = initClient(year, day);
	let input;
	try {
		input = await aocClient.fetchInput();
	} catch (error) {
		if (!force)
			throw error;
	}

	const pathToPuzzleDirectory = makePathToPuzzle(year, day);
	// ensure that the target puzzle is not yet set
	if (await hasFile(pathToPuzzleDirectory)) {
		if (!force) throw Error(`Puzzle directory already exists: ${pathToPuzzleDirectory}`);
		else throw Error('Forcing scaffold is not yet implemented'); // TODO
	}

	await mkdir(pathToPuzzleDirectory, { recursive: true });
	await Promise.all(files.map(file => copyFile(
		makePathFromScript(template.directory, file),
		makePathToPuzzle(year, day, file),
	)));
	await writeFile(makePathToPuzzle(year, day, template.input), input);

	console.log();
	console.log(chalk.bold.whiteBright('Done!'));
	console.log(chalk.bold.whiteBright('Puzzle:'.padEnd(10)), aocClient.url)
	console.log(
		chalk.bold.whiteBright('Solution:'.padEnd(10)),
		makePathToPuzzle(year, day, template.solution),
	);
	console.log();
};

const runPuzzle = async (year, day, { test, watch, debug, validate }) => {
	if (watch) throw Error('Watch is not implemented yet'); // TODO

	const { formatInput, part1, part2, validation = [] } = await import(makePathToPuzzle(year, day, template.solution));
	const input = formatInput((await readFile(makePathToPuzzle(year, day, template.input), 'utf8')).trim());

	let testsToRun = [];
	if (!test || validate) {
		const [result1, result2] = validation;
		testsToRun.push(['Part 1', part1, input, result1]);
		testsToRun.push(['Part 2', part2, input, result2]);
	}

	if (test || validate) {
		const testFile = makePathToPuzzle(year, day, template.tests);
		(await import(testFile)).tests
			.forEach((test, idx) => testsToRun.push([
				`Test p${test.part} #${idx + 1}`,
				test.part === 1 ? part1 : part2,
				formatInput(test.input),
				test.result,
				test.args,
			]));
	}

	const logLabel = string => string.padStart(10);
	const log = (label, ...messages) =>
		console.log(`${logLabel(label)}:`, ...messages);

	console.log();
	testsToRun.forEach(props => {
		const [label, solution, input, expectedResult = null, extraArgs = []] = props
		try {
			console.time(logLabel('Time'));
			console.log(chalk.bold.whiteBright(logLabel(label) + ':'));
			const result = solution(input, ...extraArgs);

			if (expectedResult === null)
				log('Result', chalk.white(result));
			else if (expectedResult === result)
				log('Result', chalk.green('✔︎'), chalk.white(result));
			else {
				log('Result', chalk.inverse.red('︎ ✖︎ '), chalk.white(result));
				log('Expected', chalk.whiteBright(expectedResult));
			}
		} catch (e) {
			logError(e, debug);
		} finally {
			console.timeEnd(logLabel('Time'));
			console.log();
		}
	});
};

const logError = (error, debug = false) => {
	console.error(chalk.red.bold.inverse('ERROR'), chalk.red.bold(error.message));
	if (debug) console.error(error);
}

const handleErrors = async (callback, debug) => {
	try {
		await callback();
	} catch (error) {
		logError(error, debug);
		process.exitCode = 1;
	}
};

const makePathFromScript = (...parts) =>
	path.join(path.dirname(import.meta.url), ...parts)
		.replace(/^[^/]*/, '');

const makePathToPuzzle = (year, day, ...rest) =>
	makePathFromScript('..', 'puzzle', year, day.padStart(2, '0'), ...rest);

const hasFile = async path => {
	try {
		const stats = await stat(path);

		return !!stats
	} catch (error) {
		if (error.code === 'ENOENT')
			return false

		throw error;
	}
}

program.parse(process.argv);
