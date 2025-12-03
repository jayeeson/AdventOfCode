import {
  Calculation,
  CALCULATION_OPERATORS_1,
  CALCULATION_OPERATORS_2,
  isValidCalculation,
  stringToCalculation,
} from '../../src/solutions/2024/7';
import { splitStringAtEOL } from '../../src/helpers/readFile';
import { sumOfArray } from '../../src/solutions/2024/1';
import { it, expect } from 'vitest';

it('can evaluate left to right', () => {
  const testInput = '292: 11 6 16 20';
  const calc = stringToCalculation(testInput);
  const isValid = isValidCalculation(calc, CALCULATION_OPERATORS_1);
  expect(isValid.valid).toBe(true);
});

it('can find possible valid calculations using add and multiply', () => {
  const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

  const calculationStrings = splitStringAtEOL(input);
  const calculations: Calculation[] = calculationStrings.map((calc) =>
    stringToCalculation(calc)
  );
  const validCalculations = calculations.map((calc) =>
    isValidCalculation(calc, CALCULATION_OPERATORS_1)
  );
  const trueValidCalculations = validCalculations.filter((calc) => calc.valid);
  const numberValidCalculations = trueValidCalculations.length;
  expect(numberValidCalculations).toBe(3);

  const calibrationResults = trueValidCalculations.map((calc) => calc.answer);
  const calibrationResult = sumOfArray(calibrationResults);
  expect(calibrationResult).toBe(3749);
});

it('can find possible valid calculations using concatenator', () => {
  const input = `156: 15 6
7290: 6 8 6 15
192: 17 8 14`;

  const calculationStrings = splitStringAtEOL(input);
  const calculations: Calculation[] = calculationStrings.map((calc) =>
    stringToCalculation(calc)
  );
  const validCalculations = calculations.map((calc) =>
    isValidCalculation(calc, CALCULATION_OPERATORS_2)
  );
  const trueValidCalculations = validCalculations.filter((calc) => calc.valid);
  const numberValidCalculations = trueValidCalculations.length;
  expect(numberValidCalculations).toBe(3);
});
