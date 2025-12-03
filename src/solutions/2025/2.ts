import { readInput } from '../../helpers/readFile';

interface Range {
  min: number;
  max: number;
}

export const solution_2025_2_1 = async () => {
  const input = await readInput('../data/2025/2_input.txt');
  const rawRanges = input.split(',');
  const ranges = rawRanges.map((rangeString) => getRangeBounds(rangeString));
  const sum = findSumOfAllInvalidIdsFromRanges(ranges);
  return sum;
};

export const solution_2025_2_2 = async () => {
  const input = await readInput('../data/2025/2_input.txt');
  const rawRanges = input.split(',');
  const ranges = rawRanges.map((rangeString) => getRangeBounds(rangeString));
  const sum = findSumOfAllInvalidIdsFromRanges(ranges, true);
  return sum;
};

export const getRangeBounds = (range: string) => {
  const [min, max] = range.split('-');
  return { min: Number(min), max: Number(max) };
};

/**
 * MUTATION ALERT - set is modified inplace
 */
export const findInvalidIds = (
  range: Range,
  set: Set<number>,
  part2?: boolean
) => {
  const { min, max } = range;

  for (let i = min; i <= max; ++i) {
    if (part2) {
    }
    if (checkIsInvalidNumber(i, part2)) {
      set.add(i);
    }
  }
  return set;
};

export const checkIsInvalidNumber = (value: number, part2?: boolean) => {
  if (part2) {
    const isInvalid = isRepeatedSequence(value);
    return isInvalid;
  }

  const isInvalid = isSameSequenceTwice(value);
  return isInvalid;
};

const isSameSequenceTwice = (value: number) => {
  const valueStr = value.toString();
  const length = valueStr.length;

  if (length % 2 === 1) {
    return false;
  }

  const firstPart = valueStr.substring(0, length / 2);
  const secondPart = valueStr.substring(length / 2);
  return firstPart === secondPart;
};

const isRepeatedSequence = (value: number) => {
  const valueStr = value.toString();
  const length = valueStr.length;

  if (length < 2) {
    return false;
  }

  for (let i = 1; i <= Math.trunc(length / 2); ++i) {
    if (length % i !== 0) {
      continue;
    }

    const numberSubstrings = length / i;
    const substrings: string[] = [];
    for (let j = 0; j < numberSubstrings; ++j) {
      substrings.push(valueStr.substring(i * j, i * (j + 1)));
    }

    const last = substrings.pop();
    const match = substrings.every((substring) => substring === last);
    if (match) {
      return true;
    }
  }

  return false;
};

export const findAllInvalidIds = (
  input: Array<{ min: number; max: number }>,
  part2?: boolean
): number[] => {
  const allInvalidIdsSet = input.reduce<Set<number>>((acc, range) => {
    acc = findInvalidIds(range, acc, part2);
    return acc;
  }, new Set());

  return Array.from(allInvalidIdsSet);
};

export const findSumOfAllInvalidIdsFromRanges = (
  ranges: Range[],
  part2?: boolean
) => {
  const allInvalidIds = findAllInvalidIds(ranges, part2);
  const sum = allInvalidIds.reduce<number>((acc, cur) => acc + cur, 0);
  return sum;
};
