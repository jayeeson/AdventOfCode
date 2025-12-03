import { readInputStringIntoNumbers } from '../../src/helpers/readFile';
import {
  addListToStoneValuesDict,
  applyStoneFunctionManyTimes,
  applyStoneFunctionToDict,
  applyStoneFunctionToDictManyTimes,
  applyStoneFunctionToList,
  getNumberOfStonesFromDict,
} from '../../src/solutions/2024/11';
import { it, expect } from 'vitest';

it('rules work', () => {
  const input = '125 17';
  const nums1 = readInputStringIntoNumbers(input);
  const { newValues: nums2 } = applyStoneFunctionToList(nums1);
  expect(nums2).toEqual([253000, 1, 7]);
  const { newValues: nums3 } = applyStoneFunctionToList(nums2);
  expect(nums3).toEqual([253, 0, 2024, 14168]);
  const { newValues: nums4 } = applyStoneFunctionToList(nums3);
  expect(nums4).toEqual([512072, 1, 20, 24, 28676032]);
  const { newValues: nums5 } = applyStoneFunctionToList(nums4);
  expect(nums5).toEqual([512, 72, 2024, 2, 0, 2, 4, 2867, 6032]);
  const { newValues: nums6 } = applyStoneFunctionToList(nums5);
  expect(nums6).toEqual([
    1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32,
  ]);
  const { newValues: nums7 } = applyStoneFunctionToList(nums6);
  expect(nums7).toEqual([
    2097446912, 14168, 4048, 2, 0, 2, 4, 40, 48, 2024, 40, 48, 80, 96, 2, 8, 6,
    7, 6, 0, 3, 2,
  ]);
  expect(nums7.length).toBe(22);
});

it('run rules X times', () => {
  const input = '125 17';
  const nums1 = readInputStringIntoNumbers(input);
  const result = applyStoneFunctionManyTimes(nums1, 6);
  expect(result.length).toBe(22);
});

it('addListToStoneValuesDict', () => {
  const input = '1 1 2 3';
  const numsList = readInputStringIntoNumbers(input);
  const dict = {};
  addListToStoneValuesDict(numsList, dict);
  expect(dict).toMatchObject({
    1: 2,
    2: 1,
    3: 1,
  });
});

it('applyStoneFunctionToDict', () => {
  const input = '512072 1 20 24 28676032';
  const numsList = readInputStringIntoNumbers(input);
  const dict = {};
  addListToStoneValuesDict(numsList, dict);
  const newDict = applyStoneFunctionToDict(dict);
  expect(newDict).toMatchObject({
    512: 1,
    72: 1,
    2024: 1,
    2: 2,
    0: 1,
    4: 1,
    2867: 1,
    6032: 1,
  });
});

it('applyStoneFunctionToDictManyTimes', () => {
  const input = '125 17';
  const numsList = readInputStringIntoNumbers(input);
  let dict = {};
  addListToStoneValuesDict(numsList, dict);
  dict = applyStoneFunctionToDictManyTimes(dict, 6);
  expect(dict).toMatchObject({
    2097446912: 1,
    14168: 1,
    4048: 1,
    2: 4,
    0: 2,
    4: 1,
    40: 2,
    48: 2,
    2024: 1,
    80: 1,
    96: 1,
    8: 1,
    6: 2,
    7: 1,
    3: 1,
  });
  const count = getNumberOfStonesFromDict(dict);
  expect(count).toBe(22);
});
