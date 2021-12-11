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

const runPuzzle = async (year, day, { test, watch }) => {
	if (watch) throw Error('Watch is not implemented yet'); // TODO
	if (test) throw Error('Test is not implemented yet'); // TODO

	const { formatInput, part1, part2 } = await import(makePathToPuzzle(year, day, template.solution));
	const input = formatInput((await readFile(makePathToPuzzle(year, day, template.input), 'utf8')).trim());

	runTest('Part 1', part1, input);
	runTest('Part 2', part2, input);
};

const runTest = (label, solution, input) => {
	try {
		console.time('Time\t');
		console.log(`${label}\t:`, solution(input));
	} finally {
		console.timeEnd('Time\t');
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
