import { T } from 'vitest/dist/chunks/traces.d.402V_yFI';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';
import { Cell, cellToString } from '../../helpers/map';
import { L } from 'vitest/dist/chunks/reporters.d.OXEK7y4s';
import { sumOfArray } from '../2024/1';

type Position1D = number;
type Map1D = string;
type Map2D = string[];

const isInMap = (map: Map1D, position: Position1D) =>
  position >= 0 && position < map.length;

const START = 'S';
const SPLITTER = '^';
const EMPTY = '.';

export async function solution_2025_7_1() {
  const input = await readInput('../data/2025/7_input.txt');
  const map2D = splitStringAtEOL(input);
  const splitCount = simulateAllBeamSplits(map2D);
  return splitCount;
}

export async function solution_2025_7_2() {
  const input = await readInput('../data/2025/7_input.txt');
  const map2D = splitStringAtEOL(input);
  const timelineCount = simulateAllBeamTimelines(map2D);
  return timelineCount;
}

export function doTachyonSplit(
  map1D: Map1D,
  lasers: Position1D[]
): { outputLasers: Position1D[]; splits: number } {
  const addAdjacentToResult = (
    input: Map1D,
    laser: Position1D,
    mutableResult: Set<Position1D>
  ) => {
    for (let next = laser - 1; next <= laser + 1; next += 2) {
      if (isInMap(input, next)) {
        mutableResult.add(next);
      }
    }
  };

  const outputLasers = new Set<Position1D>();
  let splits = 0;

  for (const laser of lasers) {
    if (map1D[laser] === SPLITTER) {
      splits += 1;
      addAdjacentToResult(map1D, laser, outputLasers);
    } else if (map1D[laser] === EMPTY) {
      if (isInMap(map1D, laser)) {
        outputLasers.add(laser);
      }
    }
  }

  return {
    outputLasers: Array.from(outputLasers),
    splits,
  };
}

function findStart(firstRow: Map1D) {
  return firstRow.search(START);
}

/** @returns final split count */
export function simulateAllBeamSplits(map2d: Map2D) {
  const startPosition = findStart(map2d[0]);

  const splits = recursiveBeamSplit(map2d, [startPosition], 1, 0);
  return splits;
}

function recursiveBeamSplit(
  map2d: Map2D,
  lasers: Position1D[],
  row: number,
  inputSplits: number
) {
  if (row >= map2d.length) {
    return inputSplits;
  }

  const line = map2d[row];
  const { outputLasers, splits } = doTachyonSplit(line, lasers);
  return recursiveBeamSplit(map2d, outputLasers, row + 1, inputSplits + splits);
}

//////////////////////////////////////////////////////
//// part 2
//////////////////////////////////////////////////////

export function simulateAllBeamTimelines(map2d: Map2D) {
  const startPosition = findStart(map2d[0]);
  const childTimelines = recursiveBeamTimeline(map2d, startPosition, 1, {});
  return childTimelines;
}

type CellStrings = string;
type Output = Record<CellStrings, number>;
function recursiveBeamTimeline(
  map2d: Map2D,
  laser: Position1D,
  row: number,
  timelineCountByCell: Output
): number {
  const thisCellString = cellToString({ x: laser, y: row });
  if (thisCellString in timelineCountByCell) {
    return timelineCountByCell[thisCellString];
  }

  if (row >= map2d.length) {
    timelineCountByCell[thisCellString] = 1;
    return 1;
  }

  const { outputLasers } = doTachyonSplit(map2d[row], [laser]);

  const children = outputLasers.map((splitLaser) =>
    recursiveBeamTimeline(map2d, splitLaser, row + 1, timelineCountByCell)
  );

  const childTimelines = sumOfArray(children);
  timelineCountByCell[thisCellString] = childTimelines;

  return childTimelines;
}
