#!/usr/bin/env node

import { copyFile, mkdir, readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';

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
		.filter(file => file !== template.directory && !files.includes(file))
	if (missingFiles.length)
		throw Error(`Files "${missingFiles.join('", "')}" are missing from template directory.`)

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
	)))
};

const runPuzzle = async (year, day, { test, watch, debug }) => {
	if (watch) throw Error('Watch is not implemented yet'); // TODO

	const { formatInput, part1, part2 } = await import(makePathToPuzzle(year, day, template.solution));
	const input = formatInput((await readFile(makePathToPuzzle(year, day, template.input), 'utf8')).trim());

	let testsToRun;
	if (!test) {
		testsToRun = [
			['Part 1', part1, input],
			['Part 2', part2, input],
		];
	} else {
		const testFile = makePathToPuzzle(year, day, template.tests);
		testsToRun = (await import(testFile)).tests
			.map((test, idx) => [
				`#${idx + 1} Part ${test.part}`,
				test.part === 1 ? part1 : part2,
				formatInput(test.input),
				test.result,
			]);
	}

	testsToRun.forEach(props => {
		try {
			runTest(...props)
		} catch (e) {
			logError(e, debug);
		}
	});
};

const runTest = (label, solution, input, expectedResult) => {
	const logLabel = string => string.padStart(10);
	const log = (label, ...messages) =>
		console.log(`${logLabel(label)}:`, ...messages)

	console.time(logLabel('Time'));
	try {
		const result = solution(input);

		if (!expectedResult)
			log(label, chalk.white(result))
		else if (expectedResult === result)
			log(label, chalk.green('✔︎'), chalk.white(result))
		else {
			log(label, chalk.inverse.red('︎ ✖︎ '), chalk.white(result))
			log('Expected', chalk.whiteBright(expectedResult))
		}
	} finally {
		console.timeEnd(logLabel('Time'));
		console.log()
	}
}

const logError = (error, debug = false) => {
	console.error(chalk.red.bold.inverse('ERROR'), chalk.red.bold(error.message));
	if (debug) console.error(error)
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
	makePathFromScript('..', 'puzzle', year, day, ...rest);

const hasFile = async path => {
	try {
		const stats = await stat(path)

		return !!stats
	} catch (error) {
		if (error.code === 'ENOENT')
			return false

		throw error
	}
}

program.parse(process.argv);
