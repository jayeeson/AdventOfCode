import { it, expect } from 'vitest';

import { numberThatChangeGradually } from '../../src/solutions/2024/2';

const lists = [
  [7, 6, 4, 2, 1],
  [1, 2, 7, 8, 9],
  [9, 7, 6, 2, 1],
  [1, 3, 2, 4, 5],
  [8, 6, 4, 4, 1],
  [1, 3, 6, 7, 9],
  [1, 2, 3, 4, 9],
  [1, 2, 3, 9, 4],
  [8, 2, 3, 4, 5],
  [2, 8, 3, 4, 5],
  [63, 60, 62, 65, 67, 69],
];

it('for gradual changes', () => {
  const numberSafe = numberThatChangeGradually(lists);
  expect(numberSafe).toBe(2);
});

it('for gradual changes with dampener', () => {
  const numberSafe = numberThatChangeGradually(lists, true);
  expect(numberSafe).toBe(9);
});
