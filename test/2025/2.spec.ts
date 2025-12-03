import {
  checkIsInvalidNumber,
  findAllInvalidIds,
  findInvalidIds,
  findSumOfAllInvalidIdsFromRanges,
  getRangeBounds,
} from '../../src/solutions/2025/2';

import { describe, it, expect } from 'vitest';

const test_data_1 = {
  expectedTotal: 1227775554,
  spans: [
    { range: '11-22', invalidIds: [11, 22] },
    { range: '95-115', invalidIds: [99] },
    { range: '998-1012', invalidIds: [1010] },
    { range: '1188511880-1188511890', invalidIds: [1188511885] },
    { range: '222220-222224', invalidIds: [222222] },
    { range: '1698522-1698528', invalidIds: [] },
    { range: '446443-446449', invalidIds: [446446] },
    { range: '38593856-38593862', invalidIds: [38593859] },
    { range: '565653-565659', invalidIds: [] },
    { range: '824824821-824824827', invalidIds: [] },
    { range: '2121212118-2121212124', invalidIds: [] },
  ],
};

const test_data_2 = {
  expectedTotal: 4174379265,
  spans: [
    { range: '11-22', invalidIds: [11, 22] },
    { range: '95-115', invalidIds: [99, 111] },
    { range: '998-1012', invalidIds: [999, 1010] },
    { range: '1188511880-1188511890', invalidIds: [1188511885] },
    { range: '222220-222224', invalidIds: [222222] },
    { range: '1698522-1698528', invalidIds: [] },
    { range: '446443-446449', invalidIds: [446446] },
    { range: '38593856-38593862', invalidIds: [38593859] },
    { range: '565653-565659', invalidIds: [565656] },
    { range: '824824821-824824827', invalidIds: [824824824] },
    { range: '2121212118-2121212124', invalidIds: [2121212121] },
  ],
};

describe('day 2', () => {
  describe('part 1', () => {
    it('gets min and max for a range', (range) => {
      const { min, max } = getRangeBounds('11-22');
      expect(min).toBe(11);
      expect(max).toBe(22);
    });

    const invalid_numbers_1 = test_data_1.spans.map((s) => s.invalidIds).flat();

    it.each(invalid_numbers_1)('find invalid numbers: %s', (value) => {
      // not a great test but it gets more thoroughly tested by proxy in other ones 🤷
      const isInvalid = checkIsInvalidNumber(value);
      expect(isInvalid).toBe(true);
    });

    it.each(test_data_1.spans)(
      'finds invalid ranges: %s',
      ({ range: rangeString, invalidIds }) => {
        const range = getRangeBounds(rangeString);
        const set = new Set<number>();
        const foundInvalidIds = findInvalidIds(range, set);
        expect([...foundInvalidIds]).toEqual(invalidIds);
      }
    );

    it('only adds a certain id once even if its in two ranges', () => {
      const rangesString = ['11-22', '22-22'];
      const ranges = rangesString.map((rs) => getRangeBounds(rs));
      const allInvalidIds = findAllInvalidIds(ranges);
      expect(allInvalidIds).toEqual([11, 22]);
    });

    it('finds sum of invalid ids', () => {
      const ranges = test_data_1.spans.map((s) => getRangeBounds(s.range));
      const sum = findSumOfAllInvalidIdsFromRanges(ranges);
      expect(sum).toEqual(test_data_1.expectedTotal);
    });
  });

  describe('part 2', () => {
    const invalid_numbers_2 = test_data_2.spans.map((s) => s.invalidIds).flat();

    it.each(invalid_numbers_2)('find invalid numbers: %s', (value) => {
      // not a great test but it gets more thoroughly tested by proxy in other ones 🤷
      const isInvalid = checkIsInvalidNumber(value, true);
      expect(isInvalid).toBe(true);
    });

    it.each(test_data_2.spans)(
      'finds invalid ranges: %s',
      ({ range: rangeString, invalidIds }) => {
        const range = getRangeBounds(rangeString);
        const set = new Set<number>();
        const foundInvalidIds = findInvalidIds(range, set, true);
        expect([...foundInvalidIds]).toEqual(invalidIds);
      }
    );

    it('finds sum of invalid ids', () => {
      const ranges = test_data_2.spans.map((s) => getRangeBounds(s.range));
      const sum = findSumOfAllInvalidIdsFromRanges(ranges, true);
      expect(sum).toEqual(test_data_2.expectedTotal);
    });
  });
});
