import { readInput } from '../../helpers/readFile';
import { sumOfArray } from './1';

enum MulDoDont {
  MUL,
  DO,
  DONT,
}

export function extractMuls(input: string): string[] {
  const reMul = /mul\(\d+,\d+\)/g;
  const mulsMatches = [...input.matchAll(reMul)];
  const muls = mulsMatches.map((m) => m[0]);
  return muls;
}

export function mulsToDigitArrays(muls: string[]) {
  const reDigitsAndComma = /\d+,\d+/g;
  const digitsAndCommaMatches = muls.map((mul) => {
    const match = mul.match(reDigitsAndComma);
    return match?.toString() ?? '';
  });

  const digitArrays = digitsAndCommaMatches.map((m) => {
    const numberStrings = m.split(',');
    return numberStrings.map((ns) => parseInt(ns, 10));
  });
  return digitArrays;
}

export function doMuls(digitArrays: number[][]) {
  const opResult = digitArrays.map((da) => da[0] * da[1]);
  return opResult;
}

export async function solution3_1() {
  const input = await readInput('../data/2024/3_input.txt');
  const mulArrays = extractMuls(input);
  const digitArrays = mulsToDigitArrays(mulArrays);
  const mulResults = doMuls(digitArrays);
  const sum = sumOfArray(mulResults);
  return sum;
}

interface ExtractedMulDoDont {
  op: string;
  type: MulDoDont | undefined;
}

export function extractMulsDosDonts(input: string): ExtractedMulDoDont[] {
  const reMulDoDont =
    /(?<mul>mul\(\d+,\d+\))|(?<do>do\(\))|(?<dont>don't\(\))/g;
  const mulDoDontMatches = [...input.matchAll(reMulDoDont)];
  const mulDoDonts = mulDoDontMatches.map((m) => {
    return {
      op: m[0],
      type: m.groups?.mul
        ? MulDoDont.MUL
        : m.groups?.do
          ? MulDoDont.DO
          : m.groups?.dont
            ? MulDoDont.DONT
            : undefined,
    };
  });
  return mulDoDonts;
}

export function getMulsAfterApplyingDosDonts(
  input: ExtractedMulDoDont[]
): string[] {
  let mulEnabled = true;
  const mulsAndUndefineds = input.map((instruction) => {
    if (instruction.type === MulDoDont.DO) {
      mulEnabled = true;
      return undefined;
    }
    if (instruction.type === MulDoDont.DONT) {
      mulEnabled = false;
      return undefined;
    }
    if (instruction.type === MulDoDont.MUL && mulEnabled) {
      return instruction.op;
    }
    return undefined;
  });

  return mulsAndUndefineds.filter((i) => typeof i === 'string');
}

export async function solution3_2() {
  const input = await readInput('../data/2024/3_input.txt');
  const mulArrays = extractMulsDosDonts(input);
  const remainingMuls = getMulsAfterApplyingDosDonts(mulArrays);
  const digitArrays = mulsToDigitArrays(remainingMuls);
  const mulResults = doMuls(digitArrays);
  const sum = sumOfArray(mulResults);
  return sum;
}
