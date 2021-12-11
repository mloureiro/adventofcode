#!/usr/bin/env node

import { readFile } from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';

const TEMPLATE = {
	directory: 'puzzle-template',
	solution: 'solution.js',
	input: 'input',
}

const program = new Command();

program
	.command('run <year> <day>')
	.description('Run Advent of Code puzzles')
	.option('-w, --watch', 'run puzzle on every change', false)
	.option('-t, --test', 'run tests instead of input', false)
	.option('-d, --debug', 'show full errors output', false)
	.action(async (year, day, { debug, test, watch }) => {
		if (watch) throw Error('Watch is not implemented yet'); // TODO
		if (test) throw Error('Test is not implemented yet'); // TODO

		const { formatInput, part1, part2 } = await import(makePathToPuzzle(year, day, TEMPLATE.solution));
		const input = formatInput((await readFile(makePathToPuzzle(year, day, TEMPLATE.input), 'utf8')).trim());

		try {
			[
				['Part 1', part1, input],
				['Part 2', part2, input],
			].forEach((test) => runTest(...test));
		} catch (error) {
			logError(error, debug);
			process.exitCode = 1;
		}
	})

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

const makePathFromScript = (...parts) =>
	path.join(path.dirname(import.meta.url), ...parts)
		.replace(/^[^/]*/, '');

const makePathToPuzzle = (year, day, ...rest) =>
	makePathFromScript('..', 'puzzle', year, day, ...rest);

program.parse(process.argv);
