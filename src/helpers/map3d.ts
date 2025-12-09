import { partition } from './array';
import { multiplyNumbers } from './math';

export interface Coordinate3D {
  x: number;
  y: number;
  z: number;
}
export type CoordinatePair3D = `${number}-${number}`; // lo-hi
export type Distances3D = Record<CoordinatePair3D, number>;

export type CoordinatePairDistance = [CoordinatePair3D, number];

/** values are connected indexes[] in the graph */
export type ConnectedCoordinateIndexes = number[];
export type Coordinate3DConnectionGraph = Array<ConnectedCoordinateIndexes>;

export function stringToCoordinate(str: string): Coordinate3D {
  const parts = str.split(',');
  if (parts.length !== 3) {
    throw new Error('Bad input, could not convert string to Coordinate');
  }
  const [x, y, z] = parts.map((part) => {
    const number = Number(part);
    if (isNaN(number) || !isFinite(number)) {
      throw new Error(`Bad number for coordinate, input: $${part}`);
    }
    return number;
  });

  return { x, y, z };
}

export function get3dDistanceSquared(
  point1: Coordinate3D,
  point2: Coordinate3D
) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dz = point2.z - point1.z;
  return dx * dx + dy * dy + dz * dz;
}

export function getCoordinate3dKey(
  index1: number,
  index2: number
): CoordinatePair3D {
  return `${index1}-${index2}`;
}

export function getCoordinatesFromKey(
  coordinates: Coordinate3D[],
  key: CoordinatePair3D
) {
  const [index1, index2] = key.split('-').map((k) => Number(k));

  return {
    indexes: [index1, index2],
    coordinates: [coordinates[index1], coordinates[index2]],
  };
}

/** Sorts in place */
export function sortCoordinatesByClosestDistance(
  distances: Distances3D
): CoordinatePairDistance[] {
  const entries = Object.entries(distances) as CoordinatePairDistance[];

  const descendingCompareFunction = (
    a: CoordinatePairDistance,
    b: CoordinatePairDistance
  ) => a[1] - b[1];
  return entries.sort(descendingCompareFunction);
}

/**
 * @param graph connections, mutated in place
 * @returns object with updated graph and last connected pair if change took place, else null
 * */
export function addPairToConnectionGraph(
  graph: Coordinate3DConnectionGraph,
  pair: CoordinatePair3D
): {
  graph: Coordinate3DConnectionGraph;
  lastConnectedPair: CoordinatePair3D;
} {
  const [id1, id2] = pair.split('-').map((id) => Number(id));

  const pairAlreadyConnected = graph.some(
    (subgraph) => subgraph.includes(id1) && subgraph.includes(id2)
  );
  if (pairAlreadyConnected) {
    return {
      graph,
      lastConnectedPair: pair,
    };
  }

  const subgraphsPartitionedByLink = partition(
    graph,
    (subgraph) => subgraph.includes(id1) || subgraph.includes(id2),
    {
      true: 'linked',
      false: 'unlinked',
    }
  );

  if (subgraphsPartitionedByLink.linked.length === 0) {
    // just push our new pair and exit
    const newGraph = [...graph, [id1, id2]];
    return {
      graph: newGraph,
      lastConnectedPair: pair,
    };
  }

  const newAllLinked = new Set<number>([
    ...subgraphsPartitionedByLink.linked.flat(),
    id1,
    id2,
  ]);
  const newGraph = [
    ...subgraphsPartitionedByLink.unlinked,
    Array.from(newAllLinked),
  ];
  return {
    graph: newGraph,
    lastConnectedPair: pair,
  };
}

export function multiplyXCoordinates(
  coordinates: Coordinate3D[],
  pair: CoordinatePair3D
) {
  const { coordinates: coords } = getCoordinatesFromKey(coordinates, pair);
  return multiplyNumbers(coords.map((coord) => coord.x));
}
