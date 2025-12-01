import { readInput, readInputStringIntoNumbers } from '../../helpers/readFile';

export interface StoneValuesDict {
  [key: number]: number;
}

const STONE_FUNCTIONS = {
  0: (): 1 => 1,
  1: (value: number): number[] => {
    const valueString = value.toString();
    const firstString = valueString.substring(0, valueString.length / 2);
    const secondString = valueString.substring(valueString.length / 2);
    return [parseInt(firstString, 10), parseInt(secondString, 10)];
  },
  2: (value: number): number => value * 2024,
};

const determineStoneRule = (value: number) => {
  if (value === 0) return 0;
  if (value.toString().length % 2 === 0) return 1;
  return 2;
};

export const applyStoneFunction = (
  value: number
): { newValue: number[]; split: boolean } => {
  const rule = determineStoneRule(value);
  const func = STONE_FUNCTIONS[rule];
  const newValue = func(value);
  if (typeof newValue !== 'number') {
    return {
      newValue,
      split: true,
    };
  }
  return {
    newValue: [newValue],
    split: false,
  };
};

export const applyStoneFunctionToList = (
  values: number[]
): { newValues: number[]; numberSplits: number } => {
  const newValues: number[] = [];
  let splits = 0;
  values.forEach((v) => {
    const out = applyStoneFunction(v);
    newValues.push(...out.newValue);
    if (out.split) {
      ++splits;
    }
  });
  return {
    newValues: newValues,
    numberSplits: splits,
  };
};

export const applyStoneFunctionManyTimes = (
  values: number[],
  times: number
) => {
  let valueStore: number[] = values.slice();
  let numberSplits = 0;
  for (let i = 0; i < times; ++i) {
    const out = applyStoneFunctionToList(valueStore);
    valueStore = out.newValues;
    if (out.numberSplits > 0) {
      numberSplits += out.numberSplits;
    }
  }
  return valueStore;
};

export const solution11_1 = async () => {
  const input = await readInput('../data/2024/11_input.txt');
  const nums = readInputStringIntoNumbers(input);
  const result = applyStoneFunctionManyTimes(nums, 25);
  return result.length;
};

// mutates the dict
export const addListToStoneValuesDict = (
  list: number[],
  dict: StoneValuesDict,
  count: number = 1
) => {
  for (const v of list) {
    if (!(v in dict)) {
      dict[v] = count;
    } else {
      dict[v] = dict[v] + count;
    }
  }
  return dict;
};

export const applyStoneFunctionToDict = (
  values: StoneValuesDict
): StoneValuesDict => {
  const newValues: StoneValuesDict = {};
  for (const num in values) {
    const out = applyStoneFunction(parseInt(num));
    addListToStoneValuesDict(out.newValue, newValues, values[num]);
  }
  return newValues;
};

// modifies the dict
export const applyStoneFunctionToDictManyTimes = (
  dict: StoneValuesDict,
  times: number
) => {
  for (let i = 0; i < times; ++i) {
    dict = applyStoneFunctionToDict(dict);
  }
  return dict;
};

export const getNumberOfStonesFromDict = (dict: StoneValuesDict) => {
  let count = 0;
  for (const key in dict) {
    count += dict[parseInt(key)];
  }
  return count;
};

export const solution11_2 = async () => {
  const input = await readInput('../data/2024/11_input.txt');
  const numsList = readInputStringIntoNumbers(input);
  let dict = {};
  addListToStoneValuesDict(numsList, dict);
  dict = applyStoneFunctionToDictManyTimes(dict, 75);
  const count = getNumberOfStonesFromDict(dict);
  return count;
};
