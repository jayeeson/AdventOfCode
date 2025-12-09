import { File } from 'buffer';
import { doInPlaceArrayItemSwap } from '../../helpers/array';
import { readInput } from '../../helpers/readFile';

export interface Block {
  id: number | undefined;
}

// 1. create array of files and free space (id === undefined)
// 2. iterate over it, moving block by block
// 3. later I jsut need the original id, and can use counter to get pos.

export const getLayoutFromDiskMap = (input: string) => {
  const fileArray: Block[] = [];
  for (let i = 0; i < input.length; ++i) {
    const digit = parseInt(input[i], 10);
    for (let j = 0; j < digit; ++j) {
      fileArray.push({ id: i % 2 === 0 ? Math.floor(i / 2) : undefined });
    }
  }
  return fileArray;
};

export const getDefragmentedLayout = (layout: Block[]) => {
  const defragmented = layout.slice();
  let forwardIt = 0;
  let backwardIt = layout.length - 1;
  while (forwardIt < backwardIt) {
    while (forwardIt < backwardIt && layout[forwardIt].id !== undefined) {
      ++forwardIt;
    }
    while (backwardIt > forwardIt && layout[backwardIt].id === undefined) {
      --backwardIt;
    }
    doInPlaceArrayItemSwap(defragmented, forwardIt, backwardIt);
    forwardIt += 1;
    backwardIt -= 1;
  }

  return defragmented.filter((b) => b.id !== undefined);
};

export const calculateDefragmentedChecksum = (layout: Block[]): number => {
  let sum = 0;
  for (let i = 0; i < layout.length; ++i) {
    sum += i * (layout[i].id ?? 0);
  }
  return sum;
};

export const solution9_1 = async () => {
  const input = await readInput('../data/2024/9_input.txt');
  const layout = getLayoutFromDiskMap(input);
  const defragmentedLayout = getDefragmentedLayout(layout);
  const checksum = calculateDefragmentedChecksum(defragmentedLayout);
  return checksum;
};

export const getDefragmentedLayoutWholeFile = (layout: Block[]) => {
  const defragmented = layout.slice();
  let lastAttemptedMoveId: number | undefined = undefined;
  for (let i = layout.length - 1; i >= 0; --i) {
    const id = defragmented[i].id;
    if (id !== undefined) {
      lastAttemptedMoveId = id + 1; // plus one for magic later
      break;
    }
  }
  while (lastAttemptedMoveId !== undefined && lastAttemptedMoveId > 0) {
    let forwardIt = 0;
    let backwardIt = layout.length - 1;
    // find a block
    while (backwardIt > 0) {
      if (lastAttemptedMoveId - 1 === defragmented[backwardIt].id) {
        --backwardIt;
        break;
      }
      --backwardIt;
    }
    let blockSize = 1;
    while (backwardIt > 0) {
      if (lastAttemptedMoveId - 1 !== defragmented[backwardIt].id) {
        break;
      }
      --backwardIt;
      ++blockSize;
    }

    let freeSize = 0;
    while (forwardIt <= backwardIt) {
      if (defragmented[forwardIt].id === undefined) {
        ++freeSize;
      }
      if (defragmented[forwardIt].id !== undefined) {
        freeSize = 0;
      }
      if (freeSize === blockSize) {
        for (let i = 0; i < blockSize; ++i) {
          doInPlaceArrayItemSwap(
            defragmented,
            backwardIt + i + 1,
            forwardIt - i
          );
        }
        break;
      }
      ++forwardIt;
    }
    --lastAttemptedMoveId;
  }

  return defragmented;
};

export const solution9_2 = async () => {
  const input = await readInput('../data/2024/9_input.txt');
  const layout = getLayoutFromDiskMap(input);
  const defragmentedLayout = getDefragmentedLayoutWholeFile(layout);
  const checksum = calculateDefragmentedChecksum(defragmentedLayout);
  return checksum;
};
