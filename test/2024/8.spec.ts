import { getCellDiff, getMapSize } from '../../src/helpers/map';
import { splitStringAtEOL } from '../../src/helpers/readFile';
import {
  AntinodeLocations,
  createMapOfAllAntinodeLocations,
  getAntennaLocations,
  getAntinodesOfLocations,
} from '../../src/solutions/2024/8';
import { it, expect } from 'vitest';

const testInput1 = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

it('can map all antennas', () => {
  const inputStrings = splitStringAtEOL(testInput1);
  const antennaLocations = getAntennaLocations(inputStrings);
  expect(antennaLocations).toMatchObject({
    A: [
      { x: 6, y: 5 },
      { x: 8, y: 8 },
      { x: 9, y: 9 },
    ],
    0: [
      { x: 8, y: 1 },
      { x: 5, y: 2 },
      { x: 7, y: 3 },
      { x: 4, y: 4 },
    ],
  });
});

it.each([
  `....
..a.
.a..
....`,
  `..a.
.a..
....
....`,
])('can get diff of map locations', (input) => {
  const inputStrings = splitStringAtEOL(input);
  const antennaLocations = getAntennaLocations(inputStrings);
  const diff = getCellDiff(antennaLocations['a'][0], antennaLocations['a'][1]);
  expect(diff).toMatchObject({ x: -1, y: 1 });
});

it.each([
  {
    input: `....
..a.
.a..
....`,
    expected: [
      { x: 3, y: 0 },
      { x: 0, y: 3 },
    ],
  },
  {
    input: `..a.
.a..
....
....`,
    expected: [{ x: 0, y: 2 }],
  },
])('can get antinodes from map locations and diffs', ({ input, expected }) => {
  const inputStrings = splitStringAtEOL(input);
  const antennaLocations = getAntennaLocations(inputStrings);
  const mapSize = getMapSize(inputStrings);
  const antinodes = getAntinodesOfLocations(
    antennaLocations['a'][0],
    antennaLocations['a'][1],
    mapSize
  );
  expect(antinodes).toEqual(expected);
});

// Also an antinode at topmost A
const mostOfTheExpectedOutput = `......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.`;

const expectedSetOfAntinodes: AntinodeLocations = {
  '6-0': { x: 6, y: 0 },
  '11-0': { x: 11, y: 0 },
  '3-1': { x: 3, y: 1 },
  '4-2': { x: 4, y: 2 },
  '10-2': { x: 10, y: 2 },
  '2-3': { x: 2, y: 3 },
  '9-4': { x: 9, y: 4 },
  '1-5': { x: 1, y: 5 },
  '6-5': { x: 6, y: 5 },
  '3-6': { x: 3, y: 6 },
  '0-7': { x: 0, y: 7 },
  '7-7': { x: 7, y: 7 },
  '10-10': { x: 10, y: 10 },
  '10-11': { x: 10, y: 11 },
};

// final Q: how many unique locations contain antinodes in the map?
it('can find all antinodes', () => {
  const inputStrings = splitStringAtEOL(testInput1);
  const antennaLocations = getAntennaLocations(inputStrings);
  const mapSize = getMapSize(inputStrings);
  const allAntinodes = createMapOfAllAntinodeLocations(
    antennaLocations,
    mapSize
  );
  expect(Object.keys(allAntinodes).length).toBe(14);
  expect(allAntinodes).toMatchObject(expectedSetOfAntinodes);
});

it('can find all antinodes, taking resonant harmonics into effect', () => {
  const testInput = `T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........`;
  const inputStrings = splitStringAtEOL(testInput);
  const antennaLocations = getAntennaLocations(inputStrings);
  const mapSize = getMapSize(inputStrings);
  const includeResonance = true;
  const allAntinodes = createMapOfAllAntinodeLocations(
    antennaLocations,
    mapSize,
    includeResonance
  );
  expect(Object.keys(allAntinodes).length).toBe(9);
});
