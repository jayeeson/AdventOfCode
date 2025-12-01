import { readInput, splitStringAtEOL } from '../../helpers/readFile';
import { sumOfArray } from './1';

export interface Calculation {
  answer: number;
  digits: number[];
}

enum CalculationOperator {
  ADD,
  MULTIPLY,
  CONCATENATE,
}
export const CALCULATION_OPERATORS_1 = [
  CalculationOperator.ADD,
  CalculationOperator.MULTIPLY,
];

export const CALCULATION_OPERATORS_2 = [
  CalculationOperator.ADD,
  CalculationOperator.MULTIPLY,
  CalculationOperator.CONCATENATE,
];

export const stringToCalculation = (input: string): Calculation => {
  const [ans, rest] = input.split(': ');
  const nums = rest.split(' ');
  return {
    answer: parseInt(ans, 10),
    digits: nums.map((n) => {
      return parseInt(n, 10);
    }),
  };
};

interface RecursiveCalcAnswer {
  valid: boolean;
}

export const doRecursiveCalculationLookingForAnswer = (
  operators: CalculationOperator[],
  numbers: number[],
  answer: number,
  validity: RecursiveCalcAnswer
): number => {
  const [first, second, ...rest] = numbers;
  if (operators.length === 0) {
    throw new Error('need at least one operator');
  }
  let recursiveAns = 0;
  for (const operator of operators) {
    if (numbers.length === 2) {
      if (first + second === answer) {
        validity.valid = true;
        return first + second;
      }
      if (first * second === answer) {
        validity.valid = true;
        return first * second;
      }
      if (operators.includes(CalculationOperator.CONCATENATE)) {
        const concatenated = parseInt(first.toString() + second.toString(), 10);
        if (concatenated === answer) {
          validity.valid = true;
          return concatenated;
        }
      }
      return 0;
    } else if (operator === CalculationOperator.ADD) {
      recursiveAns = doRecursiveCalculationLookingForAnswer(
        operators,
        [first + second, ...rest],
        answer,
        validity
      );
    } else if (operator === CalculationOperator.MULTIPLY) {
      recursiveAns = doRecursiveCalculationLookingForAnswer(
        operators,
        [first * second, ...rest],
        answer,
        validity
      );
    } else if (operator === CalculationOperator.CONCATENATE) {
      const concatenated = parseInt(first.toString() + second.toString(), 10);
      recursiveAns = doRecursiveCalculationLookingForAnswer(
        operators,
        [concatenated, ...rest],
        answer,
        validity
      );
    }
  }
  return recursiveAns;
};

export const isValidCalculation = (
  calculation: Calculation,
  calculationOperators: CalculationOperator[] = CALCULATION_OPERATORS_1
) => {
  const validity: RecursiveCalcAnswer = { valid: false };
  doRecursiveCalculationLookingForAnswer(
    calculationOperators,
    calculation.digits,
    calculation.answer,
    validity
  );
  return {
    valid: validity.valid,
    answer: calculation.answer,
  };
};

export const solution7_1 = async () => {
  const input = await readInput('../data/2024/7_input.txt');
  const calculationStrings = splitStringAtEOL(input);
  const calculations: Calculation[] = calculationStrings.map((calc) =>
    stringToCalculation(calc)
  );
  const validCalculations = calculations.map((calc) =>
    isValidCalculation(calc, CALCULATION_OPERATORS_1)
  );
  const trueValidCalculations = validCalculations.filter((calc) => calc.valid);
  const calibrationResults = trueValidCalculations.map((calc) => calc.answer);
  const calibrationResult = sumOfArray(calibrationResults);
  return calibrationResult;
};

export const solution7_2 = async () => {
  const input = await readInput('../data/2024/7_input.txt');
  const calculationStrings = splitStringAtEOL(input);
  const calculations: Calculation[] = calculationStrings.map((calc) =>
    stringToCalculation(calc)
  );
  const validCalculations = calculations.map((calc) =>
    isValidCalculation(calc, CALCULATION_OPERATORS_2)
  );
  const trueValidCalculations = validCalculations.filter((calc) => calc.valid);
  const calibrationResults = trueValidCalculations.map((calc) => calc.answer);
  const calibrationResult = sumOfArray(calibrationResults);
  return calibrationResult;
};
