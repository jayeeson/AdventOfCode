import { it, describe, expect } from 'vitest';
import { createRange } from '../../src/helpers/range';
import {
  checkIsFresh,
  getAvailableFreshFoodCount,
  getTotalFreshFoodCount,
} from '../../src/solutions/2025/5';

const testData = {
  ranges: ['3-5', '10-14', '16-20', '12-18'],
  availableIds: [1, 5, 8, 11, 17, 32],
  expectedAvailableFresh: [5, 11, 17],
  expectedTotalFresh: [3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
};

describe('day 5 2025', () => {
  it.each(testData.availableIds)(
    'should determine if a food is fresh; id=%s',
    (id) => {
      const ranges = testData.ranges.map(createRange);
      const isFresh = checkIsFresh(id, ranges);

      const expectedFresh = testData.expectedAvailableFresh.includes(id);
      expect(isFresh).toBe(expectedFresh);
    }
  );

  it('should determine number of fresh available ingredient ids', () => {
    const ranges = testData.ranges.map(createRange);
    const freshFoodCount = getAvailableFreshFoodCount(
      testData.availableIds,
      ranges
    );
    expect(freshFoodCount).toBe(testData.expectedAvailableFresh.length);
  });

  it('should determine number of total fresh ingredient ids', () => {
    const ranges = testData.ranges.map(createRange);
    const freshFoodCount = getTotalFreshFoodCount(ranges);
    expect(freshFoodCount).toBe(testData.expectedTotalFresh.length);
  });
});
