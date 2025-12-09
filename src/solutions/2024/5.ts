import { doInPlaceArrayItemSwap } from '../../helpers/array';
import { readInput, readLinesIntoLists } from '../../helpers/readFile';
import { sumOfArray } from './1';

export type OrderingRulesRecords = Record<number, number[]>;
export type PageNumberUpdate = number[];
interface InvalidUpdateInfo {
  indexChecked: number;
  conflict: number;
}
export type PageNumberValidation =
  | {
      valid: true;
      middleNumber: number;
      invalidUpdateInfo?: never;
    }
  | {
      valid: false;
      middleNumber?: never;
      invalidUpdateInfo: InvalidUpdateInfo;
    };

export interface PageManualInput {
  rules: string;
  updates: string;
}

export const convertOrderingRulesStringToRecords = (
  input: string
): OrderingRulesRecords => {
  const outRecords: OrderingRulesRecords = {};

  const lines = input.split('\n');
  lines.forEach((line) => {
    const data = line.split('|');
    const [first, second] = data.map((d) => parseInt(d, 10));

    if (first in outRecords) {
      outRecords[first].push(second);
    } else {
      outRecords[first] = [second];
    }
  });
  return outRecords;
};

export const sortOrderingRuleRecords = (
  unsortedRules: OrderingRulesRecords
): OrderingRulesRecords => {
  const sorted = Object.fromEntries(
    Object.entries(unsortedRules).map(([key, value]) => [key, value.sort()])
  );
  return sorted;
};

export const validateUpdateLineWithRules = (
  update: PageNumberUpdate,
  rules: OrderingRulesRecords
): PageNumberValidation => {
  for (let i = 0; i < update.length; ++i) {
    if (i !== 0) {
      for (let j = 0; j < i; ++j) {
        if (update[i] in rules && rules[update[i]].includes(update[j])) {
          return {
            valid: false,
            invalidUpdateInfo: { indexChecked: i, conflict: j },
          };
        }
      }
    }
  }
  if (update.length % 2 === 0) {
    throw new Error("didn't expect update to have even number of entries... ");
  }
  const middleIndex = Math.floor(Math.max(update.length - 1, 0) / 2);
  return {
    valid: true,
    middleNumber: update[middleIndex],
  };
};

export const getMiddleNumbersFromUpdates = (
  updates: PageNumberUpdate[],
  rules: OrderingRulesRecords
): number[] => {
  const middleNumbers = updates.map((update) => {
    const validationOutput = validateUpdateLineWithRules(update, rules);
    if (validationOutput.valid) {
      return validationOutput.middleNumber;
    }
    return undefined;
  });
  return middleNumbers.filter((num) => num !== undefined);
};

export const getRulesAndUpdatesFromFile = async (
  fileName: string
): Promise<PageManualInput> => {
  const rawInput = await readInput(fileName);
  const [rules, updates] = rawInput.split(/\n\n/);
  return { rules, updates };
};

export const solution5_1 = async () => {
  const { rules, updates: updatesString } = await getRulesAndUpdatesFromFile(
    '../data/2024/5_input.txt'
  );
  const ruleRecords = convertOrderingRulesStringToRecords(rules);
  const updates = readLinesIntoLists(updatesString);
  const middleNumbers = getMiddleNumbersFromUpdates(updates, ruleRecords);
  const sumOfMiddleNumbers = sumOfArray(middleNumbers);
  return sumOfMiddleNumbers;
};

export const getInvalidUpdates = (
  updates: PageNumberUpdate[],
  rules: OrderingRulesRecords
): PageNumberUpdate[] => {
  const invalidUpdates = updates.map((update) => {
    const validationOutput = validateUpdateLineWithRules(update, rules);
    if (!validationOutput.valid) {
      return update;
    }
    return undefined;
  });
  return invalidUpdates.filter((update) => update !== undefined);
};

export const reorderInvalidUpdate = (
  update: PageNumberUpdate,
  rules: OrderingRulesRecords
): PageNumberUpdate => {
  let valid = false;
  let reorderedUpdate = update.slice();
  for (let counter = 0; counter < 10000 || !valid; ++counter) {
    const validationOutput = validateUpdateLineWithRules(
      reorderedUpdate,
      rules
    );
    if (validationOutput.valid) {
      return reorderedUpdate;
    }

    doInPlaceArrayItemSwap(
      reorderedUpdate,
      validationOutput.invalidUpdateInfo.conflict,
      validationOutput.invalidUpdateInfo.indexChecked
    );
  }
  throw new Error(`Impossible to update this one... ${update.toString()}`);
};

export const solution5_2 = async () => {
  const { rules, updates: updatesString } = await getRulesAndUpdatesFromFile(
    '../data/2024/5_input.txt'
  );
  const ruleRecords = convertOrderingRulesStringToRecords(rules);
  const updates = readLinesIntoLists(updatesString);
  const invalidUpdates = getInvalidUpdates(updates, ruleRecords);
  const reorderedInvalidUpdates = invalidUpdates.map((update) =>
    reorderInvalidUpdate(update, ruleRecords)
  );
  const middleNumbersFromInvalid = getMiddleNumbersFromUpdates(
    reorderedInvalidUpdates,
    ruleRecords
  );
  const sumOfInvalidMiddleNumbers = sumOfArray(middleNumbersFromInvalid);

  return sumOfInvalidMiddleNumbers;
};
