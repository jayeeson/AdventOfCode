import { sumOfArray } from '../../src/solutions/2024/1';
import {
  doMuls,
  extractMuls,
  extractMulsDosDonts,
  getMulsAfterApplyingDosDonts,
  mulsToDigitArrays,
} from '../../src/solutions/2024/3';
import { it, expect } from 'vitest';

it('can parse out everything except mul(1,2) instructions', () => {
  const testInput =
    'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';

  const muls = extractMuls(testInput);
  const digitArrays = mulsToDigitArrays(muls);
  expect(digitArrays).toEqual([
    [2, 4],
    [5, 5],
    [11, 8],
    [8, 5],
  ]);
  const operationResults = doMuls(digitArrays);
  expect(operationResults).toEqual([8, 25, 88, 40]);
  const resultSum = sumOfArray(operationResults);
  expect(resultSum).toBe(161);
});

it("can parse: [do(), don't, mul(1,2)] instructions", () => {
  const testInput =
    "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
  const instructions = extractMulsDosDonts(testInput);
  const remainingMuls = getMulsAfterApplyingDosDonts(instructions);
  const digitArrays = mulsToDigitArrays(remainingMuls);
  expect(digitArrays).toEqual([
    [2, 4],
    [8, 5],
  ]);
  const operationResults = doMuls(digitArrays);
  expect(operationResults).toEqual([8, 40]);
  const resultSum = sumOfArray(operationResults);
  expect(resultSum).toBe(48);
});
