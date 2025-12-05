export interface Range {
  min: number;
  max: number;
}

export const createRange = (range: string): Range => {
  const [min, max] = range.split('-').map((input) => Number(input));

  if (isNaN(min) || isNaN(max)) {
    throw new Error(`Cannot create range, min or max is NaN. Input: ${range}`);
  }

  if (min > max) {
    // swap
    return { min: max, max: min };
  }
  return { min, max };
};

export const checkIsInRange = (value: number, range: Range): boolean =>
  value <= range.max && value >= range.min;

export const getRangeWidth = (range: Range): number => {
  if (range.max < range.min) {
    throw new Error('Cannot get range width, max is less than min');
  }

  return range.max - range.min + 1;
};

/** Sorts in-place */
export const sortRanges = (range: Range[]): Range[] => {
  const compareFunction = (a: Range, b: Range) => {
    return a.min - b.min;
  };

  return range.sort(compareFunction);
};

/** Input range MUST be sorted, and min < max for each range */
export function consolidateRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) {
    return [];
  }

  const merged: Range[] = [];
  let current = { ...ranges[0] };

  for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];

    if (next.min <= current.max) {
      current.max = Math.max(current.max, next.max);
    } else {
      merged.push(current);
      current = { ...next };
    }
  }

  // add last range
  merged.push(current);

  return merged;
}
