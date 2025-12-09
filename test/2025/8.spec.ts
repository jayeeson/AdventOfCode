import { it, describe, expect } from 'vitest';
import {
  connectAllBoxesAndGetLastConnected,
  convertInputToCoordinates,
  findDistanceBetweenPairs,
  getGraphAfterNClosestConnections,
  getSizesOfClosestNCircuits,
  sortConnectedGraphsByEdgeCount,
} from '../../src/solutions/2025/8';
import {
  getCoordinatesFromKey,
  multiplyXCoordinates,
  sortCoordinatesByClosestDistance,
} from '../../src/helpers/map3d';

const testData = {
  input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
  firstClosestPair: [
    { x: 162, y: 817, z: 812 },
    { x: 425, y: 690, z: 689 },
  ],
  numberOfConnections: 10,
  expectedLargest3CircuitsCount: [5, 4, 2],
  expectedMultipliedXcoordinatesOfLastConnection: 25272,
};
describe('day 8 2025', () => {
  it('can find closest pair of junction boxes', () => {
    const coordinates = convertInputToCoordinates(testData.input);
    const pairDistances = findDistanceBetweenPairs(coordinates);
    const sortedPairDistances = sortCoordinatesByClosestDistance(pairDistances);
    const closestCoordinatePairKey = sortedPairDistances[0][0];
    const closestCoordinates = getCoordinatesFromKey(
      coordinates,
      closestCoordinatePairKey
    );

    expect(closestCoordinates.coordinates).toEqual(testData.firstClosestPair);
  });

  it('can get sizes of largest circuits after N connections', () => {
    const coordinates = convertInputToCoordinates(testData.input);
    const pairDistances = findDistanceBetweenPairs(coordinates);
    const sortedPairDistances = sortCoordinatesByClosestDistance(pairDistances);

    const graphWithConnections = getGraphAfterNClosestConnections(
      testData.numberOfConnections,
      sortedPairDistances
    );

    const sortedGraph = sortConnectedGraphsByEdgeCount(graphWithConnections);

    const largest3Circuits = getSizesOfClosestNCircuits(
      testData.expectedLargest3CircuitsCount.length,
      sortedGraph
    );
    expect(largest3Circuits).toEqual(testData.expectedLargest3CircuitsCount);
  });

  it('can get multipled X coordinates of last connected boxes', () => {
    const coordinates = convertInputToCoordinates(testData.input);
    const pairDistances = findDistanceBetweenPairs(coordinates);
    const sortedPairDistances = sortCoordinatesByClosestDistance(pairDistances);

    const lastConnectedPair = connectAllBoxesAndGetLastConnected(
      coordinates.length,
      sortedPairDistances
    );

    const result = multiplyXCoordinates(coordinates, lastConnectedPair);
    expect(result).toBe(
      testData.expectedMultipliedXcoordinatesOfLastConnection
    );
  });
});
