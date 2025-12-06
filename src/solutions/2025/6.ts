import { addNumbers, multiplyNumbers } from '../../helpers/math';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';

enum Operation {
  MULTIPLY = '*',
  ADD = '+',
}

interface Problem {
  problemNumbers: number[];
  operation: Operation;
}

export async function solution_2025_6_1() {
  const input = await readInput('../data/2025/6_input.txt');
  const problems = convertInputToMathArrays(input);
  const answers = solveProblems(problems);
  const finalAnswer = addNumbers(answers);
  return finalAnswer;
}

export async function solution_2025_6_2() {
  const input = await readInput('../data/2025/6_input.txt');
  const problems = convertInputToRtlArrays(input);
  const answers = solveProblems(problems);
  const finalAnswer = addNumbers(answers);
  return finalAnswer;
}

export function convertInputToMathArrays(input: string): Problem[] {
  const lines = input.split('\n');
  const sanitizedLines = lines.map((l) => l.trim().replace(/ +/g, ' '));

  let lineNumbers: number[][] = [];
  let operations: Operation[] = [];
  let length = 0;

  const assertLength = (len: number) => {
    if (len !== length) {
      throw new Error(
        'Did not parse input correctly, supposed to be rectangular structure'
      );
    }
  };

  for (const line of sanitizedLines) {
    const isNumber = line[0].substring(0, 1).match(/\d/) !== null;
    if (isNumber) {
      const numbers = line.split(' ').map((n) => Number(n));
      if (length === 0) {
        length = numbers.length;
      } else {
        assertLength(numbers.length);
      }

      lineNumbers.push(numbers);

      continue;
    }

    let rawOperations = line.split(' ');
    assertLength(rawOperations.length);
    operations = rawOperations.map(operationStringToEnum);
  }

  return operations.map((operation, i) => ({
    operation,
    problemNumbers: lineNumbers.map((numbers) => numbers[i]),
  }));
}

function operationStringToEnum(operation: string): Operation {
  switch (operation) {
    case Operation.MULTIPLY:
      return Operation.MULTIPLY;
    case Operation.ADD:
      return Operation.ADD;
    default:
      throw new Error(`Bad operator: ${operation}`);
  }
}

export function solveProblems(problems: Problem[]) {
  const answers = problems.map((problem) => {
    switch (problem.operation) {
      case Operation.ADD:
        return addNumbers(problem.problemNumbers);
      case Operation.MULTIPLY:
        return multiplyNumbers(problem.problemNumbers);
      default:
        throw new Error('Unexpected operator?');
    }
  });

  return answers;
}

export function convertInputToRtlArrays(input: string) {
  const lines = splitStringAtEOL(input);
  const lineLength = lines[0].length;

  const output: Problem[] = [];

  let problemNumbers: number[] = [];
  let pendingOperation = '';
  for (let i = lineLength - 1; i >= 0; --i) {
    let numberSpaces = 0;
    let thisNumber = '';
    for (const line of lines) {
      const char = line[i];
      if (char.match(/\d/)) {
        thisNumber += char;
      }
      if (char.match(/[\*\+]/)) {
        pendingOperation = char;
      }
      if (char === ' ') {
        numberSpaces += 1;
      }
    }

    if (thisNumber !== '') {
      problemNumbers.push(Number(thisNumber));
    }

    if (numberSpaces === lines.length || i === 0) {
      if (pendingOperation === '') {
        throw new Error('expected operation to be set by now');
      }

      output.push({
        problemNumbers,
        operation: operationStringToEnum(pendingOperation),
      });
      pendingOperation = '';
      numberSpaces = 0;
      problemNumbers = [];
    }
  }

  return output;
}
