import { it, describe, expect } from 'vitest';
import {
  findMinimumButtonPresses,
  findTotalNumberOfButtonPresses,
  LBJinputLine,
  Lights,
  parseInput,
  toggleLightsWithButton,
  toggleLightsWithButtonSequence,
} from '../../src/solutions/2025/10';
import { splitStringAtEOL } from '../../src/helpers/readFile';
import { addArrayItemLengths } from '../../src/helpers/array';

const testData = {
  input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
  expectedPresses: [
    [4, 5],
    [2, 3, 4],
    [1, 2],
  ],
  expectedFirstInput: {
    lights: [0, 1, 1, 0],
    buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
    joltage: [3, 5, 4, 7],
  } satisfies LBJinputLine,
};
describe('day 10 2025', () => {
  it('can parse input', () => {
    const firstLine = splitStringAtEOL(testData.input)[0];
    const parsedInput = parseInput(firstLine)[0];
    expect(parsedInput).toMatchObject(testData.expectedFirstInput);
  });

  it.each<{
    inputLights: Lights;
    button: number;
    expectedLights: Lights;
  }>([
    { inputLights: [0, 0, 0, 0], button: 1, expectedLights: [0, 1, 0, 1] },
    { inputLights: [1, 0, 1, 1], button: 1, expectedLights: [1, 1, 1, 0] },
  ])(
    'should toggle lights when button is pressed',
    ({ inputLights, button, expectedLights }) => {
      const newLights = toggleLightsWithButton(
        inputLights,
        button,
        testData.expectedFirstInput.buttons
      );
      expect(newLights).toEqual(expectedLights);
    }
  );

  it.each<{
    buttonSequence: number[];
    expectedLights: Lights;
  }>([
    {
      buttonSequence: [4, 5],
      expectedLights: [0, 1, 1, 0],
    },
  ])('can toggle multiple buttons', ({ buttonSequence, expectedLights }) => {
    const newLights = toggleLightsWithButtonSequence(
      expectedLights.length,
      buttonSequence,
      testData.expectedFirstInput.buttons
    );
    expect(newLights).toEqual(expectedLights);
  });

  it.each(
    testData.input.split('\n').map((text, index) => ({
      input: text,
      expectedButtonPresses: testData.expectedPresses[index].length,
    }))
  )(
    'should find minimum button presses to get light arragement, $input',
    ({ input, expectedButtonPresses }) => {
      const { lights, buttons } = parseInput(input)[0];
      const minimumPresses = findMinimumButtonPresses(lights, buttons);
      expect(minimumPresses).toEqual(expectedButtonPresses);
    }
  );

  it('should find minimum total presses', () => {
    const parsed = parseInput(testData.input);
    const totalPresses = findTotalNumberOfButtonPresses(parsed);

    const expectedTotalPresses = addArrayItemLengths(testData.expectedPresses);
    expect(totalPresses).toBe(expectedTotalPresses);
  });
});
