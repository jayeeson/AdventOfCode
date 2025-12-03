import { getMapSize } from '../../src/helpers/map';
import {
  readDigitsIntoLists,
  readLinesIntoLists,
  splitStringAtEOL,
} from '../../src/helpers/readFile';
import { sumOfArray } from '../../src/solutions/2024/1';
import {
  findAllTrailheads,
  findPossibleTrailheads,
  getTrailheadNewRatingScores,
  getTrailheadScores,
} from '../../src/solutions/2024/10';
import { it, expect } from 'vitest';

const simpleTrailInput = `1110111
1111111
1112111
6543456
7111117
8111118
9111119`;

const trailInput2 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

it('can find trails', () => {
  const strings = splitStringAtEOL(simpleTrailInput);
  const size = getMapSize(strings);
  const possibleTrailheads = findPossibleTrailheads(strings);
  expect(possibleTrailheads.length).toBe(1);
  const trails = findAllTrailheads(possibleTrailheads, strings, size);
  const trailHeads = Object.keys(trails);
  expect(trailHeads.length).toBe(1);
  const trailEndsOfFirstTrailHead = Object.keys(trails[trailHeads[0]]);
  expect(trailEndsOfFirstTrailHead.length).toBe(2);
});

it.each([
  {
    input: simpleTrailInput,
    expected: 2,
    firstTrailStart: '3-0',
    expectedFirstTrailEnds: [
      { x: 6, y: 6 },
      { x: 0, y: 6 },
    ],
    expectedNewRatingScore: 2,
  },
  {
    input: trailInput2,
    expected: 36,
    firstTrailStart: '2-0',
    expectedFirstTrailEnds: [
      { x: 4, y: 3 },
      { x: 5, y: 4 },
      { x: 4, y: 5 },
      { x: 1, y: 0 },
      { x: 0, y: 3 },
    ],
    expectedNewRatingScore: 81,
  },
])(
  'can get sum of scores of trailHeads',
  ({
    input,
    expected,
    expectedFirstTrailEnds,
    firstTrailStart,
    expectedNewRatingScore,
  }) => {
    const strings = splitStringAtEOL(input);
    const size = getMapSize(strings);
    const possibleTrailheads = findPossibleTrailheads(strings);
    const trails = findAllTrailheads(possibleTrailheads, strings, size);
    const firstTrailEnds = Object.values(trails[firstTrailStart]).map(
      (uniqueTrail) => uniqueTrail.trail.end
    );
    expect(firstTrailEnds).toStrictEqual(expectedFirstTrailEnds);
    const scores = getTrailheadScores(trails);
    const sumOfScores = sumOfArray(scores);
    expect(sumOfScores).toBe(expected);

    const revisedScoring = getTrailheadNewRatingScores(trails);
    const sumOfRevisedScores = sumOfArray(revisedScoring);
    expect(sumOfRevisedScores).toBe(expectedNewRatingScore);
  }
);
