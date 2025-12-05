import { describe, it, expect } from 'vitest';
import {
  consolidateRanges,
  createRange,
  getRangeWidth,
  Range,
  sortRanges,
} from '../range';

describe('ranges helper', () => {
  describe('consolidateRanges', () => {
    it('should consolidate ranges', () => {
      const inputRangeStrings = ['3-5', '10-14', '16-20', '12-18'];
      const expectedConsolidatedRangeStrings = ['3-5', '10-20'];

      const inputRanges = inputRangeStrings.map(createRange);
      const expectedConsolidatedRanges =
        expectedConsolidatedRangeStrings.map(createRange);

      const sortedInputRanges = sortRanges(inputRanges);
      const consolidatedRanges = consolidateRanges(sortedInputRanges);
      expect(consolidatedRanges).toEqual(expectedConsolidatedRanges);
    });
  });

  describe('getRangeWidth', () => {
    it.each<{ range: Range; expectedWidth: number }>([
      { range: { min: 0, max: 0 }, expectedWidth: 1 },
      { range: { min: 0, max: 1 }, expectedWidth: 2 },
      { range: { min: 0, max: 2 }, expectedWidth: 3 },
    ])('should return inclusive range width', ({ range, expectedWidth }) => {
      const width = getRangeWidth(range);
      expect(width).toBe(expectedWidth);
    });
  });
});
