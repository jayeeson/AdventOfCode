import {
  addPairToConnectionGraph,
  ConnectedCoordinateIndexes,
  Coordinate3D,
  Coordinate3DConnectionGraph,
  CoordinatePair3D,
  CoordinatePairDistance,
  Distances3D,
  get3dDistanceSquared,
  getCoordinate3dKey,
  multiplyXCoordinates,
  sortCoordinatesByClosestDistance,
  stringToCoordinate,
} from '../../helpers/map3d';
import { multiplyNumbers } from '../../helpers/math';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';

export async function solution_2025_8_1() {
  const input = await readInput('../data/2025/8_input.txt');
  const coordinates = convertInputToCoordinates(input);
  const pairDistances = findDistanceBetweenPairs(coordinates);
  const sortedPairDistances = sortCoordinatesByClosestDistance(pairDistances);

  const graphWithConnections = getGraphAfterNClosestConnections(
    1000,
    sortedPairDistances
  );

  const sortedGraph = sortConnectedGraphsByEdgeCount(graphWithConnections);

  const largest3Circuits = getSizesOfClosestNCircuits(3, sortedGraph);
  return multiplyNumbers(largest3Circuits);
}

export async function solution_2025_8_2() {
  const input = await readInput('../data/2025/8_input.txt');
  const coordinates = convertInputToCoordinates(input);
  const pairDistances = findDistanceBetweenPairs(coordinates);
  const sortedPairDistances = sortCoordinatesByClosestDistance(pairDistances);

  const lastConnectedPair = connectAllBoxesAndGetLastConnected(
    coordinates.length,
    sortedPairDistances
  );
  const multipledXCoordinates = multiplyXCoordinates(
    coordinates,
    lastConnectedPair
  );
  return multipledXCoordinates;
}

export function convertInputToCoordinates(input: string) {
  const lines = splitStringAtEOL(input);
  return lines.map((line) => stringToCoordinate(line));
}

export function findDistanceBetweenPairs(coordinates: Coordinate3D[]) {
  const distances: Distances3D = {};
  for (let i = 0; i < coordinates.length; ++i) {
    for (let j = i + 1; j < coordinates.length; ++j) {
      const key = getCoordinate3dKey(i, j);
      distances[key] = get3dDistanceSquared(coordinates[i], coordinates[j]);
    }
  }

  return distances;
}

export function sortConnectedGraphsByEdgeCount(
  graph: Coordinate3DConnectionGraph
) {
  const compareFunction = (
    a: ConnectedCoordinateIndexes,
    b: ConnectedCoordinateIndexes
  ) => a.length - b.length;

  const sortedGraph = graph.sort(compareFunction);
  return sortedGraph;
}

export function getGraphAfterNClosestConnections(
  N: number,
  coordinatePairDistances: CoordinatePairDistance[]
): Coordinate3DConnectionGraph {
  let graph: Coordinate3DConnectionGraph = [];

  for (let i = 0; i < N; ++i) {
    const [pairKey, _] = coordinatePairDistances[i];

    const updatedConnections = addPairToConnectionGraph(graph, pairKey);
    graph = updatedConnections.graph;
  }
  return graph;
}

export function getSizesOfClosestNCircuits(
  N: number,
  sortedGraph: Coordinate3DConnectionGraph
): number[] {
  const circuitsByDecreasingSize = sortedGraph.slice(-N).reverse();
  return circuitsByDecreasingSize.map((circuit) => circuit.length);
}

export function connectAllBoxesAndGetLastConnected(
  boxCount: number,
  coordinatePairDistances: CoordinatePairDistance[]
): CoordinatePair3D {
  let graph: Coordinate3DConnectionGraph = [];

  const getIsGraphAllConnected = () =>
    graph.length === 1 && graph[0].length === boxCount;

  for (let i = 0; i < coordinatePairDistances.length; ++i) {
    const [pairKey, _] = coordinatePairDistances[i];

    const updatedConnections = addPairToConnectionGraph(graph, pairKey);
    graph = updatedConnections.graph;

    if (getIsGraphAllConnected()) {
      return updatedConnections.lastConnectedPair;
    }
  }

  throw new Error('Bug: could not connect all of them?');
}
