import { it, describe, expect } from 'vitest';
import {
  convertInputToMathArrays,
  convertInputToRtlArrays,
  solveProblems,
} from '../../src/solutions/2025/6';
import { addNumbers } from '../../src/helpers/math';

const testData = {
  input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
  answers: [33210, 490, 4243455, 401],
  finalAnswer: 4277556,
  rtlAnswers: [1058, 3253600, 625, 8544],
  rtlFinalAnswer: 3263827,
};

describe('day 6 2025', () => {
  it('can get expected answer', () => {
    const problems = convertInputToMathArrays(testData.input);
    const answers = solveProblems(problems);
    expect(answers).toEqual(testData.answers);
    const finalAnswer = addNumbers(answers);
    expect(finalAnswer).toBe(testData.finalAnswer);
  });

  it('can get expected rtl final answer', () => {
    const problems = convertInputToRtlArrays(testData.input);
    const answers = solveProblems(problems);
    expect(answers).toEqual(testData.rtlAnswers);
    const finalAnswer = addNumbers(answers);
    expect(finalAnswer).toBe(testData.rtlFinalAnswer);
  });
});
