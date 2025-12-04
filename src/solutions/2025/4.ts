import {
  castIntegerToDirection8,
  Cell,
  drawOnMap,
  getAllPositions,
  getCellOneAwayByDirection,
  getMapSize,
  isInMap,
} from '../../helpers/map';
import { readInput } from '../../helpers/readFile';

const ROLL_SYMBOL = '@';
const VACANT_SYMBOL = '.';

export async function solution_2025_4_1() {
  const input = await readInput('../data/2025/4_input.txt');
  const map = input.split('\n');

  const accessibleCount = getAccessibleRollCount(map);
  return accessibleCount;
}

export async function solution_2025_4_2() {
  const input = await readInput('../data/2025/4_input.txt');
  const map = input.split('\n');

  const accessibleCount = getAccessibleRollCount(map, true);
  return accessibleCount;
}

function getAdjacentRollCount(
  map: string[],
  position: Cell
): number | undefined {
  if (map[position.y][position.x] !== ROLL_SYMBOL) {
    return undefined;
  }

  const size = getMapSize(map);
  let adjacentRollCount = 0;
  for (let i = 0; i < 8; ++i) {
    const direction = castIntegerToDirection8(i);

    const cell = getCellOneAwayByDirection(direction, position);
    if (isInMap(cell, size) && map[cell.y][cell.x] === ROLL_SYMBOL) {
      adjacentRollCount += 1;
    }
  }
  return adjacentRollCount;
}

export function getIsRollAccessible(
  map: string[],
  position: Cell
): boolean | undefined {
  if (map[position.y][position.x] !== ROLL_SYMBOL) {
    return undefined;
  }

  const adjacentRollCount = getAdjacentRollCount(map, position);
  if (adjacentRollCount === undefined) {
    return undefined;
  }
  if (adjacentRollCount < 4) {
    return true;
  }
  return false;
}

function clearRollsFromMap(map: string[], rolls: Cell[]) {
  const updatedMap = [...map];
  for (const roll of rolls) {
    if (updatedMap[roll.y][roll.x] !== ROLL_SYMBOL) {
      continue;
    }

    drawOnMap(roll, updatedMap, VACANT_SYMBOL);
  }
  return updatedMap;
}

export function getAccessibleRollCount(
  _map: string[],
  unlimitedRemoval?: boolean
): number {
  let currentMap = [..._map];

  const allPositions = getAllPositions(currentMap);
  let outOfMoves = false;
  let totalAccessibleRollCount = 0;

  do {
    const removedRollPositions = allPositions.reduce<Cell[]>(
      (removedRollPositions, position) => {
        const isAccessible = getIsRollAccessible(currentMap, position);
        if (isAccessible) {
          removedRollPositions.push(position);
        }
        return removedRollPositions;
      },
      []
    );

    totalAccessibleRollCount += removedRollPositions.length;
    currentMap = clearRollsFromMap(currentMap, removedRollPositions);
    outOfMoves = removedRollPositions.length === 0;
  } while (unlimitedRemoval && !outOfMoves);

  return totalAccessibleRollCount;
}
