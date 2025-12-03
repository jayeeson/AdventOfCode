import { readInput } from '../../src/helpers/readFile';
import {
  Block,
  calculateDefragmentedChecksum,
  getDefragmentedLayout,
  getDefragmentedLayoutWholeFile,
  getLayoutFromDiskMap,
} from '../../src/solutions/2024/9';
import { it, expect } from 'vitest';

const testInput1 = '12345';
const layout1 = '0..111....22222'; // dots are free space
const expected1: Block[] = [
  { id: 0 },
  { id: 2 },
  { id: 2 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 2 },
  { id: 2 },
  { id: 2 },
];

const layout1prime = [
  { id: 0 },
  { id: undefined },
  { id: undefined },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: 2 },
  { id: 2 },
  { id: 2 },
  { id: 2 },
  { id: 2 },
];
const testInput2 = '2333133121414131402';
const layout2 = '00...111...2...333.44.5555.6666.777.888899';
const expected2 = [
  { id: 0 },
  { id: 0 },
  { id: 9 },
  { id: 9 },
  { id: 8 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 8 },
  { id: 8 },
  { id: 8 },
  { id: 2 },
  { id: 7 },
  { id: 7 },
  { id: 7 },
  { id: 3 },
  { id: 3 },
  { id: 3 },
  { id: 6 },
  { id: 4 },
  { id: 4 },
  { id: 6 },
  { id: 5 },
  { id: 5 },
  { id: 5 },
  { id: 5 },
  { id: 6 },
  { id: 6 },
];
// size then free space, alternating.
// files have ids, starting at 0 (auto-incrementing), before rearranging.

// 1. move blocks from right side to left side free space.
// 2. create new checksum: sum of block position * original file id

it.each([{ input: testInput1, expected: layout1prime }])(
  'can get filespace representation of disk map',
  ({ input, expected }) => {
    const layout = getLayoutFromDiskMap(input);
    expect(layout).toMatchObject(expected);
  }
);

it.each([
  { input: testInput1, expected: expected1 },
  { input: testInput2, expected: expected2 },
])('can defragment', ({ input, expected }) => {
  const layout = getLayoutFromDiskMap(input);
  const defragmentedLayout = getDefragmentedLayout(layout);
  expect(defragmentedLayout).toMatchObject(expected);
});

it('can compute checksum', () => {
  const layout = getLayoutFromDiskMap(testInput2);
  const defragmentedLayout = getDefragmentedLayout(layout);
  const checksum = calculateDefragmentedChecksum(defragmentedLayout);
  expect(checksum).toBe(1928);
});

const expectedWholeFile = [
  { id: 0 },
  { id: 0 },
  { id: 9 },
  { id: 9 },
  { id: 2 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 7 },
  { id: 7 },
  { id: 7 },
  { id: undefined },
  { id: 4 },
  { id: 4 },
  { id: undefined },
  { id: 3 },
  { id: 3 },
  { id: 3 },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: 5 },
  { id: 5 },
  { id: 5 },
  { id: 5 },
  { id: undefined },
  { id: 6 },
  { id: 6 },
  { id: 6 },
  { id: 6 },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: undefined },
  { id: 8 },
  { id: 8 },
  { id: 8 },
  { id: 8 },
  { id: undefined },
  { id: undefined },
];

it.each([
  { input: testInput2, expected: expectedWholeFile, expectedChecksum: 2858 },
  {
    input: '122',
    expected: [
      { id: 0 },
      { id: 1 },
      { id: 1 },
      { id: undefined },
      { id: undefined },
    ],
    expectedChecksum: 3,
  },
])(
  'can move whole files only in defragmentation',
  ({ input, expected, expectedChecksum }) => {
    const layout = getLayoutFromDiskMap(input);
    const defragmentedLayout = getDefragmentedLayoutWholeFile(layout);
    expect(defragmentedLayout).toMatchObject(expected);
    const checksum = calculateDefragmentedChecksum(defragmentedLayout);
    expect(checksum).toBe(expectedChecksum);
  }
);
