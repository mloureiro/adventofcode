export const validation = [207, 804];

export const formatInput = input =>
	input.split('\n')
		.map(line => line.match(/^(\w+) to (\w+) = (\d+)$/).splice(1))
		.map(([from, to, distance]) => [from, to, parseInt(distance)]);

const fetchAllLocations = routes =>
	[...new Set(routes.flatMap(([from, to]) => [from, to]))];

const calculateMap = routes =>
	routes.reduce((map, [from, to, distance]) => {
		if (!map[from]) map[from] = {};
		map[from][to] = distance;

		if (!map[to]) map[to] = {};
		map[to][from] = distance;

		return map;
	}, {});

const calculateRoutes = (route, queue, map) => {
	const current = route[route.length - 1]

	if (queue.length === 1)
		return map[current][queue[0]]
			? [[...route, queue[0]]]
			: null;

	return Object.keys(map[current])
		.filter(l => queue.includes(l))
		.flatMap(l => {
			const routes = calculateRoutes(
				[...route, l],
				queue.filter(q => q !== l),
				map,
			);

			return routes;
		})
		.filter(Boolean)
};

const calculatePossitleRoutes = (routes) => {
	const locations = fetchAllLocations(routes);
	const map = calculateMap(routes);

	return locations.flatMap(firstLocation =>
		calculateRoutes(
			[firstLocation],
			locations.filter(l => l !== firstLocation),
			map,
		),
	);
};

const calculateRouteCost = (route, map) =>
	route.reduce((cost, location, index) =>
		index !== 0
		&& (cost + map[route[index - 1]][location]),
		0);

const calculateAllRoutesCosts = routes => {
	const map = calculateMap(routes);

	return calculatePossitleRoutes(routes)
		.map(route => calculateRouteCost(route, map));
}

export const part1 = routes =>
	Math.min(...calculateAllRoutesCosts(routes));

export const part2 = routes =>
	Math.max(...calculateAllRoutesCosts(routes));
