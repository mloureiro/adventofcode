export const validation = [];

export const formatInput = input => {
	const map = createMap();
	input.split('\n')
		.map(r => r.split('-'))
		.forEach(([from, to]) => map.addConnection(from, to));

	return map;
};

const MAP_KEY = {
	start: 'start',
	end: 'end',
};

const createNode = key => {
	const isLargeCave = key.replace(/[A-Z]/g, '').length === 0;
	const connections = new Map();
	return {
		key,
		get isLargeCave() { return isLargeCave },
		get isSmallCave() { return !isLargeCave },
		addConnection(c) { connections.set(c.key, c) },
		getConnections() { return [...connections.values()] },
		toString() {
			return `[${key}]: ${this.getConnections().map(c => c.key).join(',')}`
		}
	};
};

const createMap = () => {
	const caves = {};
	return {
		get(key) { return caves[key] },
		addConnection(a, b) {
			if (!caves[a]) caves[a] = createNode(a);
			if (!caves[b]) caves[b] = createNode(b);

			caves[a].addConnection(caves[b]);
			caves[b].addConnection(caves[a]);
		},
		toString() {
			return Object.values(caves)
				.map(node => node.toString())
				.join('\n');
		},
	};
};

const createPath = (initialPath = []) => {
	const path = [...initialPath];
	const visited = new Set(initialPath);
	return {
		get path() { return [...path] },
		add(node) {
			visited.add(node.key);
			path.push(node.key);
		},
		canGoTo(node) {
			return node.isLargeCave || !visited.has(node.key);
		},
		clone() { return createPath(path) },
	};
}

const cavesExcludedForDoubleVisit = new Set(Object.values(MAP_KEY))
const createPathWithDoubleVisit = (initialPath = [], hasDoubleVisited = false) => {
	const path = createPath(initialPath);
	let hasDoubleVisitedInternal = hasDoubleVisited;
	return {
		add(node) {
			if (!path.canGoTo(node))
				hasDoubleVisitedInternal = true;

			path.add(node);
		},
		canGoTo(node) {
			return path.canGoTo(node)
				|| (!hasDoubleVisitedInternal && !cavesExcludedForDoubleVisit.has(node.key))
		},
		clone() {
			return createPathWithDoubleVisit(
				path.path,
				hasDoubleVisitedInternal,
			);
		}
	};
}

const calculatePaths = (node, map, path) => {
	let innerPath = path.clone()
	innerPath.add(node);
	if (node.key === MAP_KEY.end)
		return [innerPath];

	let paths = [];
	const connections = node.getConnections();
	for (let connection of connections) {
		if (innerPath.canGoTo(connection)) {
			calculatePaths(connection, map, innerPath)
				.forEach(path => paths.push(path))
		}
	}

	return paths;
};

export const part1 = map => {
	return calculatePaths(
		map.get(MAP_KEY.start),
		map,
		createPath(),
	).length;
};

export const part2 = map => {
	return calculatePaths(
		map.get(MAP_KEY.start),
		map,
		createPathWithDoubleVisit(),
	).length;
};
