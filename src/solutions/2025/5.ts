import { readInput, splitStringAtEOL } from '../../helpers/readFile';
import {
  checkIsInRange,
  consolidateRanges,
  createRange,
  getRangeWidth,
  Range,
  sortRanges,
} from '../../helpers/range';

export async function solution_2025_5_1() {
  const input = await readInput('../data/2025/5_input.txt');
  const [rawRanges, rawIds] = input.split('\n\n');

  const ranges = splitStringAtEOL(rawRanges).map(createRange);
  const ids = splitStringAtEOL(rawIds).map((id) => Number(id));

  const freshFoodCount = getAvailableFreshFoodCount(ids, ranges);
  return freshFoodCount;
}

export async function solution_2025_5_2() {
  const input = await readInput('../data/2025/5_input.txt');
  const [rawRanges, _] = input.split('\n\n');

  const ranges = splitStringAtEOL(rawRanges).map(createRange);
  const freshFoodCount = getTotalFreshFoodCount(ranges);
  return freshFoodCount;
}

export function checkIsFresh(id: number, ranges: Range[]) {
  for (const range of ranges) {
    const isInRange = checkIsInRange(id, range);
    if (isInRange) {
      return true;
    }
  }

  return false;
}

export function getAvailableFreshFoodCount(
  foodIds: number[],
  freshRanges: Range[]
) {
  let freshCount = 0;
  for (const id of foodIds) {
    const isFresh = checkIsFresh(id, freshRanges);
    if (isFresh) {
      freshCount += 1;
    }
  }
  return freshCount;
}

export function getTotalFreshFoodCount(freshRanges: Range[]) {
  const sortedRanges = sortRanges(freshRanges);
  const consolidatedRanges = consolidateRanges(sortedRanges);

  let freshCount = 0;
  for (const range of consolidatedRanges) {
    const freshThisRange = getRangeWidth(range);
    freshCount += freshThisRange;
  }
  return freshCount;
}
