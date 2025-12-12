import { isArrayEqual } from '../../helpers/array';
import { factorial } from '../../helpers/math';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';

export async function solution_2025_10_1() {
  const input = await readInput('../data/2025/10_input.txt');
  const parsed = parseInput(input);
  const minTotalPresses = findTotalNumberOfButtonPresses(parsed);
  return minTotalPresses;
}

export async function solution_2025_10_2() {
  const input = await readInput('../data/2025/10_input.txt');
  return -1;
}

export type Lights = Array<0 | 1>;
export type LightsButton = number[];
export type LightsButtons = LightsButton[];

export interface LBJinputLine {
  lights: Lights;
  buttons: LightsButton[];
  joltage: number[];
}

export function parseInput(input: string): LBJinputLine[] {
  const lines = splitStringAtEOL(input);
  return lines.map((line) => {
    const [firstPart, rest] = line.split(']');
    const rawLights = firstPart.slice(1);
    let lights: Lights = [];
    for (const char of rawLights) {
      switch (char) {
        case '.':
          lights.push(0);
          break;
        case '#':
          lights.push(1);
          break;
      }
    }

    const [secondPart, rest2] = rest.split('{');
    const rawButtons = secondPart.trim().replaceAll(/[()]/g, '').split(' ');
    const buttons = rawButtons.map((rawButton) => {
      const numbers = rawButton.split(',');
      return numbers.map((n) => Number(n));
    });

    const rawJoltage = rest2.slice(0, rest2.length - 1).split(',');
    const joltage = rawJoltage.map((j) => Number(j));

    return {
      lights,
      buttons,
      joltage,
    };
  });
}

export function toggleLightsWithButton(
  inputLights: Lights,
  buttonIndex: number,
  buttons: LightsButtons
): Lights {
  let outputLights = inputLights;
  const button = buttons[buttonIndex];
  for (const toggle of button) {
    outputLights[toggle] = outputLights[toggle] === 0 ? 1 : 0;
  }
  return outputLights;
}

export function toggleLightsWithButtonSequence(
  lightCount: number,
  buttonSequence: number[],
  buttons: LightsButtons
): Lights {
  let outputLights = new Array(lightCount).fill(0);
  for (const button of buttonSequence) {
    outputLights = toggleLightsWithButton(outputLights, button, buttons);
  }

  return outputLights;
}

export function findMinimumButtonPresses(
  expectedLights: Lights,
  buttons: LightsButtons
) {
  let minPresses = Number.MAX_SAFE_INTEGER;

  const numButtons = buttons.length;
  const limit = Math.pow(2, numButtons);
  for (let i = 1; i < limit; ++i) {
    const buttonIndexes: number[] = [];

    let bit = 0;
    let j = i;
    while (j > 0) {
      const masked = j & 1;
      if (masked) {
        buttonIndexes.push(bit);
      }

      j = j >> 1;
      bit += 1;
    }

    const outputLights = toggleLightsWithButtonSequence(
      expectedLights.length,
      buttonIndexes,
      buttons
    );
    if (isArrayEqual(outputLights, expectedLights)) {
      if (buttonIndexes.length < minPresses) {
        minPresses = buttonIndexes.length;
      }
    }
  }

  return minPresses;
}

export function findTotalNumberOfButtonPresses(input: LBJinputLine[]) {
  let totalPresses = 0;
  for (const { lights, buttons } of input) {
    const minimumPresses = findMinimumButtonPresses(lights, buttons);
    totalPresses += minimumPresses;
  }
  return totalPresses;
}
