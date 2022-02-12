export const validation = [3176, 14710];

export const formatInput = input =>
	input.split('\n')
		.map(instruction => {
			const [action, to] = instruction.split(' -> ')
			let a, b, op;
			if (!action.includes(' ')) {
				b = /^\d+$/.test(action) ? Number(action) : action;
				op = 'SET';
			} else {
				[, a, op, b] = action.match(/^(.*?)\s?(AND|OR|LSHIFT|RSHIFT|NOT)\s(.*)$/);
			}

			return a ? [to, op, a, b] : [to, op, b, null];
		});

const init = input => {
	const done = new Map();
	const todo = new Map();

	input.forEach(([to, op, a, b]) =>
		isNumber(a) && b === null
			? done.set(to, execute(op, a))
			: todo.set(to, [to, op, a, b]));

	return [todo, done];
}

const MAX_NUMBER = parseInt(''.padStart(16, '1'), 2);

const isNumber = s => /^\d+$/.test(s);

const execute = (op, a, b) =>
	({
		'SET': a => a,
		'AND': (a, b) => a & b,
		'OR': (a, b) => a | b,
		'LSHIFT': (a, b) => a << b,
		'RSHIFT': (a, b) => a >> b,
		'NOT': a => MAX_NUMBER - Number(a),
	})[op](a, b);

const process = (todo, done) => {
	while (todo.size) {
		todo.forEach(([to, op, a, b]) => {
			const va = isNumber(a) ? Number(a) : (done.get(a) ?? null);
			const vb = isNumber(b) ? Number(b) : (done.get(b) ?? null);

			if (va !== null && (vb !== null || b === null)) {
				done.set(to, execute(op, va, vb));
				todo.delete(to);
			}
		});
	}

	return done;
}

export const part1 = input => {
	return process(...init(input)).get('a');
};

export const part2 = input => {
	const b = process(...init(input)).get('a');

	let [todo, done] = init(input)
	done.set('b', b);
	todo.delete('b');

	return process(todo, done).get('a');
};
