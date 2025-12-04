import { readDigitsIntoLists, readInput } from '../../helpers/readFile';

export const solution_2025_3_1 = async () => {
  const input = await readInput('../data/2025/3_input.txt');
  const jolts = readDigitsIntoLists(input);
  const maxSumJoltage = getSumAllMaxJoltages(jolts);
  return maxSumJoltage;
};

export const solution_2025_3_2 = async () => {
  const input = await readInput('../data/2025/3_input.txt');
  const jolts = readDigitsIntoLists(input);
  const maxSumJoltage = getSumAllMaxJoltages(jolts, true);
  return maxSumJoltage;
};

type BatteryBank = number[];

export function getMaxDigit(digits: number[]) {
  let maxDigit = 0;
  let position = -1;

  for (let i = 0; i < digits.length; ++i) {
    const digit = digits[i];

    if (digit > maxDigit) {
      maxDigit = digit;
      position = i;
    }

    if (maxDigit === 9) {
      break;
    }
  }

  return {
    maxDigit,
    position,
  };
}

export function getMaxJoltage(jolts: BatteryBank, joltageLength: number) {
  let max = '';
  let lastPos = 0;
  for (let i = 0; i < joltageLength; ++i) {
    const digit = getMaxDigit(
      jolts.slice(lastPos + i, jolts.length - joltageLength + i + 1)
    );

    max += String(digit.maxDigit);
    lastPos += digit.position;
  }

  return Number(max);
}

export function getSumAllMaxJoltages(banks: BatteryBank[], part2?: boolean) {
  let sum = 0;
  for (const bank of banks) {
    sum += getMaxJoltage(bank, part2 ? 12 : 2);
  }
  return sum;
}
