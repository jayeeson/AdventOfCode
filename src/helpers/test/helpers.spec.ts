import { doInPlaceArrayItemSwap } from '../arrayItemSwap';
import { createFrequencyMap } from '../createFrequencyMap';
import {
  readInput,
  readLinesIntoLists,
  readNumbersIntoTwoLists,
} from '../readFile';

import { describe, it, expect } from 'vitest';

it('readinput works for one line', async () => {
  const input = await readInput('helpers/test/test-data/oneline_data.txt');
  expect(input).toBe('123');
});

it('readNumbersTwoLists works', async () => {
  const expect1 = [31594, 46608, 78052, 52680, 92973];
  const expect2 = [93577, 24099, 70524, 49933, 56887];

  const input = await readInput('helpers/test/test-data/1_fake_data.txt');
  const { list1, list2 } = readNumbersIntoTwoLists(input);
  expect(list1).toEqual(expect1);
  expect(list2).toEqual(expect2);
});

it('create frequency map retuns correct numbers', () => {
  const data = [4, 3, 5, 3, 9, 3];
  const map = createFrequencyMap(data);
  expect(map).toMatchObject({
    4: 1,
    3: 3,
    5: 1,
    9: 1,
  });
});

it('read lines into number lists', async () => {
  const expected = [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
  ];

  const input = await readInput('helpers/test/test-data/2_fake_data.txt');
  const numberLists = readLinesIntoLists(input);
  expect(numberLists).toEqual(expected);
});

it('can swap inside array', () => {
  const array = [1, 2, 3];
  doInPlaceArrayItemSwap(array, 0, 2);
  expect(array).toEqual([3, 2, 1]);
});
