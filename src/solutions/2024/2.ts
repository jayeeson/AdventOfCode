import { readInput, readLinesIntoLists } from '../../helpers/readFile';

const DEBUG = false;

enum FirstSign {
  INCREASING,
  DECREASING,
}

interface SingleResult {
  index: number;
  safe: boolean;
}

function testListForGradualChanges(list: number[]): SingleResult {
  let signChange: FirstSign | undefined;
  for (let i = 0; i < list.length - 1; ++i) {
    const delta = list[i + 1] - list[i];
    if (delta === 0) {
      return {
        index: i,
        safe: false,
      };
    }

    const currentSignChange =
      delta > 0 ? FirstSign.INCREASING : FirstSign.DECREASING;
    if (i === 0) {
      signChange = currentSignChange;
    } else {
      if (signChange !== currentSignChange) {
        return {
          index: i,
          safe: false,
        };
      }
    }

    if (Math.abs(delta) > 3) {
      return {
        index: i,
        safe: false,
      };
    }
  }
  return {
    index: -1,
    safe: true,
  };
}

export function numberThatChangeGradually(
  lists: number[][],
  dampener: boolean = false
) {
  const safetyList = lists.map((list) => {
    const testResult = testListForGradualChanges(list);
    if (testResult.safe || !dampener) {
      return testResult;
    }

    if (testResult.index > 0) {
      const behindRemovedList = [
        ...list.slice(0, testResult.index - 1),
        ...list.slice(testResult.index),
      ];

      const testResultRemoveBehind =
        testListForGradualChanges(behindRemovedList);
      if (testResultRemoveBehind.safe) {
        return testResultRemoveBehind;
      }
    }

    if (testResult.index < list.length) {
      const currentRemovedList = [
        ...list.slice(0, testResult.index),
        ...list.slice(Math.min(testResult.index + 1, list.length)),
      ];

      const testResultRemoveCurrent =
        testListForGradualChanges(currentRemovedList);
      if (testResultRemoveCurrent.safe) {
        return testResultRemoveCurrent;
      }
    }

    if (testResult.index + 1 < list.length) {
      const nextRemovedList = [
        ...list.slice(0, testResult.index + 1),
        ...list.slice(Math.min(testResult.index + 2, list.length)),
      ];

      const testResultNextRemoved = testListForGradualChanges(nextRemovedList);
      if (testResultNextRemoved.safe) {
        return testResultNextRemoved;
      }
    }
    return {
      index: -1,
      safe: false,
    };
  });

  const safeList = safetyList.filter((i) => i?.safe);

  if (DEBUG) {
    const failureList = lists.map((l, i) => {
      if (!safetyList[i].safe) {
        return l;
      }
      return false;
    });
    console.log(failureList.filter((l) => l));
  }

  return safeList.length;
}

export async function solution2_1() {
  const input = await readInput('../data/2024/2_input.txt');
  const numberLists = readLinesIntoLists(input);
  const numberSafe = numberThatChangeGradually(numberLists);
  return numberSafe;
}

export async function solution2_2() {
  const input = await readInput('../data/2024/2_input.txt');
  const numberLists = readLinesIntoLists(input);
  const numberSafe = numberThatChangeGradually(numberLists, true);
  return numberSafe;
}
