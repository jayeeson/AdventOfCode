import { deepEqual } from '../../helpers/deepEqual';
import {
  Cell,
  cellToString,
  createMoveString,
  Direction4Points,
  getCellOneAwayByDirection,
  getDirectionFromNeighboringCell1ToCell2,
  getMapSize,
  isInMap,
  Size,
} from '../../helpers/map';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';
import { sumOfArray } from './1';
import { Direction4PointsArray } from './10';

export interface GardenRegionSpecs {
  area: number;
  perimeter: number;
  sides?: number;
}

export interface GardenRegionSpecsMap {
  [key: string]: GardenRegionSpecs[];
}

export interface GardenRegionCells {
  [key: string]: Cell; // key is unique `x-y`
}

export const findFirstCellNotInMap = (
  size: Size,
  allMappedCells: GardenRegionCells
): Cell | undefined => {
  if (Object.keys(allMappedCells).length >= size.width * size.height) {
    return undefined;
  }
  for (let i = 0; i < size.width; ++i) {
    for (let j = 0; j < size.height; ++j) {
      if (!(`${i}-${j}` in allMappedCells)) {
        return { x: i, y: j };
      }
    }
  }
  return undefined;
};

export const findFirstCellInCellsButNotInMap = (
  size: Size,
  cells: Cell[],
  allMappedCells: GardenRegionCells
): Cell | undefined => {
  if (Object.keys(allMappedCells).length >= cells.length) {
    return undefined;
  }
  for (const cell of cells) {
    if (!(cellToString(cell) in allMappedCells)) {
      return cell;
    }
  }
  return undefined;
};

export const directionChangeMeansAdditionalSides = (
  direction1: Direction4Points,
  direction2: Direction4Points
) => {
  const direction1Number = direction1 as number;
  const direction2Number = direction2 as number;

  const directionChangeNumber = (direction2Number - direction1Number + 4) % 4;
  if (directionChangeNumber === 3) {
    return true;
  }
};

interface RecursivelyGetRegionCellsProps {
  position: Cell;
  size: Size;
  thisRegion: GardenRegionCells;
  allMappedCells: GardenRegionCells;
  characterToFind: RegExp;
  shouldContinue: (nextPosition: Cell) => boolean;
}

export const recursivelyGetRegionCells = ({
  position,
  size,
  thisRegion,
  allMappedCells,
  characterToFind,
  shouldContinue,
}: RecursivelyGetRegionCellsProps): void => {
  const uniqueKey = `${position.x}-${position.y}`;
  if (!(uniqueKey in allMappedCells)) {
    thisRegion[uniqueKey] = position;
    allMappedCells[uniqueKey] = position;
  }

  for (const direction of Direction4PointsArray) {
    const nextPosition = getCellOneAwayByDirection(direction, position);

    if (!nextPosition) {
      break;
    }

    const nextUniqueKey = `${nextPosition.x}-${nextPosition.y}`;
    if (
      !isInMap(nextPosition, size) ||
      shouldContinue(nextPosition) ||
      nextUniqueKey in allMappedCells
    ) {
      continue;
    }

    recursivelyGetRegionCells({
      position: nextPosition,
      size,
      thisRegion,
      allMappedCells,
      characterToFind,
      shouldContinue,
    });
  }
};

const calculatePerimeterOfThisCell = (
  cells: Cell[],
  index: number,
  size: Size
): number => {
  let perimeter = 4;
  for (const direction of Direction4PointsArray) {
    const oneAway = getCellOneAwayByDirection(direction, cells[index]);
    if (!isInMap(oneAway, size)) {
      continue;
    }
    if (cells.some((cell) => cell.x === oneAway.x && cell.y === oneAway.y)) {
      perimeter -= 1;
    }
  }
  return perimeter;
};

export const getInitialNeighboringCell = (
  currentCell: Cell,
  cells: Cell[],
  size: Size
): Cell => {
  const rightCell = getCellOneAwayByDirection(
    Direction4Points.EAST,
    currentCell
  );
  if (isInMap(rightCell, size)) {
    if (cells.some((cell) => deepEqual(cell, rightCell))) {
      return rightCell;
    }
  }

  const downCell = getCellOneAwayByDirection(
    Direction4Points.SOUTH,
    currentCell
  );
  if (isInMap(downCell, size)) {
    if (cells.some((cell) => deepEqual(cell, downCell))) {
      return downCell;
    }
  }
  throw new Error('expected initial neighboringCell to be east or south');
};

export const getSubsequentNeighboringCell = (
  currentCell: Cell,
  cells: Cell[],
  size: Size,
  lastDirection: Direction4Points
): Cell => {
  const lastDirectionNumber = lastDirection as number;
  const directionsToTryNumbers = [
    (lastDirectionNumber - 1 + 4) % 4,
    lastDirectionNumber,
    (lastDirectionNumber + 1) % 4,
    (lastDirectionNumber + 2) % 4,
  ];
  const directionsToTry = directionsToTryNumbers.map(
    (d) => d as Direction4Points
  );

  for (let direction of directionsToTry) {
    const nextCell = getCellOneAwayByDirection(direction, currentCell);
    if (isInMap(nextCell, size)) {
      if (cells.some((cell) => deepEqual(cell, nextCell))) {
        return nextCell;
      }
    }
  }
  throw new Error('impossible to get here');
};

interface UniqueMoves {
  [key: string]: boolean;
}

const calculateOutsideSidesInRegion = (cells: Cell[], size: Size) => {
  let outsideSides = 4;
  let initialDirection: Direction4Points | undefined;
  const perimeterCells: GardenRegionCells = {};
  const uniqueMoves: UniqueMoves = {};

  let currentCell = cells[0];
  const firstCell = { ...currentCell };
  perimeterCells[cellToString(firstCell)] = firstCell;
  let neighboringCell: Cell = getInitialNeighboringCell(
    currentCell,
    cells,
    size
  );

  let lastMove = createMoveString(currentCell, neighboringCell);

  while (!(lastMove in uniqueMoves)) {
    uniqueMoves[lastMove] = true;
    const newDirection = getDirectionFromNeighboringCell1ToCell2(
      currentCell,
      neighboringCell
    );

    if (initialDirection === undefined) {
      initialDirection = newDirection;
    } else if (
      directionChangeMeansAdditionalSides(initialDirection, newDirection)
    ) {
      outsideSides += 2;
    }
    initialDirection = newDirection;
    currentCell = neighboringCell;
    neighboringCell = getSubsequentNeighboringCell(
      currentCell,
      cells,
      size,
      newDirection
    );
    lastMove = createMoveString(currentCell, neighboringCell);
  }
  return outsideSides;
};

interface Donut {
  tl: Cell;
  tr: Cell;
  br: Cell;
  bl: Cell;
}

export const findAllDonuts = (cells: GardenRegionCells, size: Size) => {
  const allDonuts: Donut[] = [];
  for (const key in cells) {
    const cell = cells[key];
    for (let x = 1; x < size.width - cell.x; ++x) {
      for (let y = 1; y < size.height - cell.y; ++y) {
        const possibleDonut: Donut = {
          tl: cell,
          tr: { x: cell.x + x, y: cell.y },
          br: { x: cell.x + x, y: cell.y + y },
          bl: { x: cell.x, y: cell.y + y },
        };
        let isDonut = true;
        for (let i = 1; i <= x; ++i) {
          if (
            !(
              cellToString({ x: cell.x + i, y: cell.y }) in cells &&
              cellToString({ x: cell.x + i, y: cell.y + y }) in cells
            )
          ) {
            isDonut = false;
            break;
          }
        }
        for (let j = 1; j <= y; ++j) {
          if (
            !(
              cellToString({ x: cell.x, y: cell.y + j }) in cells &&
              cellToString({ x: cell.x + x, y: cell.y + j }) in cells
            )
          ) {
            isDonut = false;
            break;
          }
        }
        if (isDonut && x > 1 && y > 1) {
          allDonuts.push(possibleDonut);
        }
      }
    }
  }
  return allDonuts;
};

const getCellsInsideDonut = (donut: Donut) => {
  const insideCells: Cell[] = [];
  for (let i = 1; i < donut.tr.x - donut.tl.x; ++i) {
    for (let j = 1; j < donut.br.y - donut.tr.y; ++j) {
      insideCells.push({ x: donut.tl.x + i, y: donut.tl.y + j });
    }
  }
  return insideCells;
};

const getCellsNotInRegion = (cells: Cell[], region: GardenRegionCells) => {
  const nonRegionCells: Cell[] = [];
  for (let i = 0; i < cells.length; ++i) {
    if (cellToString(cells[i]) in region) {
      continue;
    }
    nonRegionCells.push(cells[i]);
  }
  return nonRegionCells;
};

const calculateInsideSidesInRegion = (
  cells: GardenRegionCells,
  size: Size
): number => {
  // TO FIND INSIDE SIDES
  // 1. find all donuts
  // 2. for all donuts, get cells inside them
  // 3. determine which cells inside them aren't part of the region
  // 4. group those cells into unique regions (unduplicated by donuts)
  // 5. get outside sides of those regions
  let insideSides = 0;

  const allDonuts = findAllDonuts(cells, size);
  if (allDonuts.length === 0) {
    return 0;
  }
  const nonRegionRegions: GardenRegionSpecsMap = {};
  for (const donut of allDonuts) {
    const insideCells = getCellsInsideDonut(donut);
    const nonRegionCells = getCellsNotInRegion(insideCells, cells);

    let position: Cell | undefined = nonRegionCells[0];
    const characterToFindRegex = new RegExp(/\w/);
    const allMappedCells: GardenRegionCells = {};

    let i = 0;
    while (position !== undefined) {
      const thisRegion: GardenRegionCells = {};
      recursivelyGetRegionCells({
        position,
        size,
        thisRegion,
        allMappedCells,
        characterToFind: characterToFindRegex,
        shouldContinue: (nextPosition: Cell) =>
          !nonRegionCells.some((c) => deepEqual(c, nextPosition)),
      });
      const infosForRegion = calculateInfosForGardenRegion(
        thisRegion,
        size,
        true
      );
      if (position) {
        nonRegionRegions[cellToString(position)] = [infosForRegion];
      }
      position = findFirstCellInCellsButNotInMap(
        size,
        nonRegionCells,
        allMappedCells
      );
    }
  }
  for (const key in nonRegionRegions) {
    const allRegions = nonRegionRegions[key];
    for (const region of allRegions) {
      if (region.sides) {
        insideSides += region.sides;
      }
    }
  }

  return insideSides;
};

export const calculateNumberSidesInRegion = (
  cells: GardenRegionCells,
  size: Size,
  outsideSidesOnly: boolean
): number => {
  if (Object.keys(cells).length <= 2) {
    return 4;
  }
  const outsideSides = calculateOutsideSidesInRegion(
    Object.values(cells),
    size
  );
  const insideSides = outsideSidesOnly
    ? 0
    : calculateInsideSidesInRegion(cells, size);
  return outsideSides + insideSides;
};

const calculateInfosForGardenRegion = (
  cells: GardenRegionCells,
  size: Size,
  calculateSides: boolean,
  outsideSidesOnly: boolean = false
): GardenRegionSpecs => {
  const cellsArray = Object.values(cells);
  const perimeters = cellsArray.map((cell, i) =>
    calculatePerimeterOfThisCell(Object.values(cells), i, size)
  );

  return {
    area: Object.keys(cells).length,
    perimeter: sumOfArray(perimeters),
    sides: calculateSides
      ? calculateNumberSidesInRegion(cells, size, outsideSidesOnly)
      : 0,
  };
};

export const getAllRegionInfo = (
  lines: string[],
  calculateSides: boolean = false
) => {
  const size = getMapSize(lines);
  const allCells: GardenRegionCells = {};
  const regionSpecsMap: GardenRegionSpecsMap = {};

  let position: Cell | undefined = { x: 0, y: 0 };
  while (position !== undefined) {
    const characterToFind = lines[position.y][position.x];
    const thisRegion: GardenRegionCells = {};
    recursivelyGetRegionCells({
      position,
      size,
      thisRegion,
      allMappedCells: allCells,
      characterToFind: new RegExp(characterToFind),
      shouldContinue: (nextPosition: Cell) => {
        return !lines[nextPosition.y][nextPosition.x].match(characterToFind);
      },
    });
    position = findFirstCellNotInMap(size, allCells);
    const infosForRegion = calculateInfosForGardenRegion(
      thisRegion,
      size,
      calculateSides
    );

    if (characterToFind in regionSpecsMap) {
      regionSpecsMap[characterToFind].push(infosForRegion);
    } else {
      regionSpecsMap[characterToFind] = [infosForRegion];
    }
  }
  return regionSpecsMap;
};

export const getGardenFencePriceInfo = (
  regionSpecsMap: GardenRegionSpecsMap,
  calcWithPerimeter: boolean = true
) => {
  let totalPrice = 0;
  for (const key in regionSpecsMap) {
    const regions = regionSpecsMap[key];
    const priceForTheseRegions = regions.map(
      (r) => r.area * (calcWithPerimeter ? r.perimeter : (r.sides ?? 0))
    );
    totalPrice += sumOfArray(priceForTheseRegions);
  }
  return totalPrice;
};

export const solution12_1 = async (usePerimeter: boolean = true) => {
  const input = await readInput('../data/2024/12_input.txt');
  const lines = splitStringAtEOL(input);
  const regionInfo = getAllRegionInfo(lines, !usePerimeter);
  const totalPrice = getGardenFencePriceInfo(regionInfo, usePerimeter);
  return totalPrice;
};

export const solution12_2 = async () => {
  return await solution12_1(false);
};
