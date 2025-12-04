import { it, describe, expect } from 'vitest';
import { getAllPositions } from '../../src/helpers/map';
import {
  getAccessibleRollCount,
  getIsRollAccessible,
} from '../../src/solutions/2025/4';

const testData = {
  input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
  answer: `..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.`,
  expectedAccessibleRolls: 13,
  expectedAccessibleRollsUnlimitedRemoval: 43
};

describe('day 4', () => {
  const ACCESSIBLE_ROLL = 'x';

  const allPositions = getAllPositions(testData.input.split('\n'));
  it.each(allPositions)(
    'should determine accessibility of a single roll at position %s',
    (position) => {
      const grid = testData.input.split('\n');
      const answer = testData.answer.split('\n');

      const isAccessible = getIsRollAccessible(grid, position);
      const expectedAccessible =
        answer[position.y][position.x] === ACCESSIBLE_ROLL;
      expect(!!isAccessible).toBe(expectedAccessible);
    }
  );

  it('should determine total number of accessible rolls', () => {
    const grid = testData.input.split('\n');

    const accessibleCount = getAccessibleRollCount(grid);
    expect(accessibleCount).toBe(testData.expectedAccessibleRolls);
  });

  it('should determine total number of accessible rolls after unlimited removal', () => {
    const grid = testData.input.split('\n');

    const accessibleCount = getAccessibleRollCount(grid, true);
    expect(accessibleCount).toBe(testData.expectedAccessibleRollsUnlimitedRemoval);
  });
});
