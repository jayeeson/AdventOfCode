import { describe, expect, it } from 'vitest';
import { readDigitsIntoLists } from '../../src/helpers/readFile';
import {
  getMaxDigit,
  getMaxJoltage,
  getSumAllMaxJoltages,
} from '../../src/solutions/2025/3';

const testData = {
  maxTotalOutput_2digits: 357,
  maxTotalOutput_12digits: 3121910778619,
  banks: [
    {
      batteries: '987654321111111',
      maxJoltage_2digits: 98,
      maxJoltage_12digits: 987654321111,
    },
    {
      batteries: '811111111111119',
      maxJoltage_2digits: 89,
      maxJoltage_12digits: 811111111119,
    },
    {
      batteries: '234234234234278',
      maxJoltage_2digits: 78,
      maxJoltage_12digits: 434234234278,
    },
    {
      batteries: '818181911112111',
      maxJoltage_2digits: 92,
      maxJoltage_12digits: 888911112111,
    },
  ],
};

describe('day 3', () => {
  it.each([
    { digits: '12345', expectedMaxDigit: 5, expectedPosition: 4 },
    { digits: '54321', expectedMaxDigit: 5, expectedPosition: 0 },
    { digits: '1992', expectedMaxDigit: 9, expectedPosition: 1 },
  ])(
    'can get max digit and position',
    ({ digits, expectedMaxDigit, expectedPosition }) => {
      const jolts = readDigitsIntoLists(digits)[0];
      const { maxDigit, position } = getMaxDigit(jolts);
      expect(maxDigit).toBe(expectedMaxDigit);
      expect(position).toBe(expectedPosition);
    }
  );

  it.each(testData.banks)(
    'can find the largest joltage (2 digit joltage)',
    (bank) => {
      const jolts = readDigitsIntoLists(bank.batteries)[0];
      const maxJoltage = getMaxJoltage(jolts, 2);
      expect(maxJoltage).toBe(bank.maxJoltage_2digits);
    }
  );

  it.each(testData.banks)(
    'can find the largest joltage (12 digit joltage)',
    (bank) => {
      const jolts = readDigitsIntoLists(bank.batteries)[0];
      const maxJoltage = getMaxJoltage(jolts, 12);
      expect(maxJoltage).toBe(bank.maxJoltage_12digits);
    }
  );

  it('can sum all the max joltages (2 digit joltage)', () => {
    const jolts = testData.banks.reduce<number[][]>((acc, cur) => {
      const thisBank = readDigitsIntoLists(cur.batteries)[0];
      acc.push(thisBank);
      return acc;
    }, []);

    const sum = getSumAllMaxJoltages(jolts);
    expect(sum).toBe(testData.maxTotalOutput_2digits);
  });

  it('can sum all the max joltages (12 digit joltage)', () => {
    const jolts = testData.banks.reduce<number[][]>((acc, cur) => {
      const thisBank = readDigitsIntoLists(cur.batteries)[0];
      acc.push(thisBank);
      return acc;
    }, []);

    const sum = getSumAllMaxJoltages(jolts, true);
    expect(sum).toBe(testData.maxTotalOutput_12digits);
  });
});
