import {
  addDirectionsToClosedPathLines,
  Cell,
  cellToString,
  createLinesForClosedPath,
  createRectangleFromTwoCorners,
  determineIfLinesIntersect,
  Direction4Points,
  findTopRightCornerCell,
  getAdjacentCellDirection,
  getCellDiff,
  getCellOneAwayByDirection,
  getLineDirection,
  isCellInArea,
  isCellInLine,
  isCellOneAwayIn4CardinalDirections,
  isLineACell,
  Line,
  removeCornersFromRectangleLines,
  reverseLine,
  sortCoordinatesByIncreasingX,
  stringToCell,
  isLineWithInsideDirection,
  LooseLineWithInsideDirection,
  LineWithInsideDirection,
} from '../../helpers/map';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';

export async function solution_2025_9_1() {
  const input = await readInput('../data/2025/9_input.txt');
  const redTileCoordinates = convertInputToRedTileCoordinates(input);
  const sortedTiles = sortCoordinatesByIncreasingX(redTileCoordinates);
  const largestArea = findLargestRectangleArea(sortedTiles);
  return largestArea;
}

export async function solution_2025_9_2_slow() {
  const input = await readInput('../data/2025/9_input.txt');
  const redTileCoordinates = convertInputToRedTileCoordinates(input);
  const cornerCell = findTopRightCornerCell(redTileCoordinates);
  const exitBorderMap = createExitBorderMapObject(
    redTileCoordinates,
    cornerCell.index
  );
  const largestArea = findLargestAreaWithoutCrossingBorderSlow(
    redTileCoordinates,
    exitBorderMap
  );
  return largestArea;
}

export async function solution_2025_9_2() {
  const input = await readInput('../data/2025/9_input.txt');
  const redTiles = convertInputToRedTileCoordinates(input);
  const borderLines = createLinesForClosedPath(redTiles);
  const largestArea = findLargestAreaWithoutCrossingBorderFast(
    redTiles,
    borderLines
  );
  return largestArea;
}

export function convertInputToRedTileCoordinates(input: string): Cell[] {
  const lines = splitStringAtEOL(input);
  return lines.map((line) => stringToCell(line, ','));
}

export function findLargestRectangleArea(sortedTiles: Cell[]): number {
  let maxArea = 0;
  for (let i = 0; i < sortedTiles.length; ++i) {
    for (let j = sortedTiles.length - 1; j > i; --j) {
      const delta = getCellDiff(sortedTiles[i], sortedTiles[j]);
      const area = (delta.x + 1) * (delta.y + 1);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}

interface ExitCell {
  cell: Cell;
  exitDirections: Direction4Points[];
}
type ExitBorderMap = Record<string, ExitCell>;

export function createExitBorderMapObject(
  adjacentTiles: Cell[],
  startIndex: number
): ExitBorderMap {
  const borderMap: ExitBorderMap = {};

  const addToBorderMap = (
    cell: Cell,
    direction: Direction4Points,
    previousPenultimateRedTile: Cell | undefined
  ) => {
    const prevCellDirection =
      previousPenultimateRedTile &&
      isCellOneAwayIn4CardinalDirections(cell, previousPenultimateRedTile)
        ? getAdjacentCellDirection(cell, previousPenultimateRedTile)
        : null;

    const exitDirection = (direction + 3) % 4; // orthogonal left of vector
    const shouldAddExitDirection = prevCellDirection !== exitDirection;

    const cellString = cellToString(cell);
    if (cellString in borderMap && shouldAddExitDirection) {
      borderMap[cellString]['exitDirections'] = [
        ...borderMap[cellString].exitDirections,
        exitDirection,
      ];
    } else {
      borderMap[cellString] = {
        cell,
        exitDirections: shouldAddExitDirection ? [exitDirection] : [],
      };
    }
  };

  let previousPenultimateRedTile: Cell | undefined;
  for (let i = startIndex + 1; i <= adjacentTiles.length + startIndex; ++i) {
    const iModulo = i % adjacentTiles.length;
    const currentPosition =
      adjacentTiles[iModulo - 1] ?? adjacentTiles[adjacentTiles.length - 1];
    const nextTile = adjacentTiles[iModulo];

    const direction = getAdjacentCellDirection(
      currentPosition,
      adjacentTiles[iModulo]
    );
    let cell: Cell | undefined;
    if (
      direction === Direction4Points.NORTH ||
      direction === Direction4Points.SOUTH
    ) {
      for (let j = currentPosition.y; j !== nextTile.y; j += direction - 1) {
        cell = { x: currentPosition.x, y: j };
        addToBorderMap(cell, direction, previousPenultimateRedTile);
      }
    }

    if (
      direction === Direction4Points.EAST ||
      direction === Direction4Points.WEST
    ) {
      for (let j = currentPosition.x; j !== nextTile.x; j -= direction - 2) {
        cell = { x: j, y: currentPosition.y };
        addToBorderMap(cell, direction, previousPenultimateRedTile);
      }
    }

    previousPenultimateRedTile = cell;
  }
  return borderMap;
}

export function findLargestAreaWithoutCrossingBorderSlow(
  tiles: Cell[],
  exitBorderMap: ExitBorderMap
): number {
  let maxArea = 0;
  for (let i = 0; i < tiles.length; ++i) {
    for (let j = tiles.length - 1; j > i; --j) {
      const tile1 = tiles[i];
      const tile2 = tiles[j];
      const delta = getCellDiff(tile1, tile2);
      const area = (Math.abs(delta.x) + 1) * (Math.abs(delta.y) + 1);

      if (area < maxArea) {
        continue;
      }

      let invalid = false;
      // check all cells in the area: is it in the border?
      // if yes, check that there is not a cell in the exitDirection
      //    if yes, then it is an invalid area
      const xDirection = delta.x > 0 ? 1 : -1;
      const yDirection = delta.y > 0 ? 1 : -1;
      for (let a = 0; a <= Math.abs(delta.x) && !invalid; ++a) {
        for (let b = 0; b <= Math.abs(delta.y) && !invalid; ++b) {
          const tile: Cell = {
            x: tile1.x + a * xDirection,
            y: tile1.y + b * yDirection,
          };
          const tileString = cellToString(tile);
          if (tileString in exitBorderMap) {
            for (const direction of exitBorderMap[tileString].exitDirections) {
              const adjacent = getCellOneAwayByDirection(direction, tile);
              // check if this cell is in the area. if it is, reject.
              const areaCrossedBorder = isCellInArea(adjacent, [tile1, tile2]);
              if (areaCrossedBorder) {
                invalid = true;
                break;
              }
            }
          }
        }
      }

      if (!invalid) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}

export function findLargestAreaWithoutCrossingBorderFast(
  redTiles: Cell[],
  borderLines: Line[]
): number {
  let maxArea = 0;
  for (let i = 0; i < redTiles.length; ++i) {
    for (let j = redTiles.length - 1; j > i; --j) {
      const tile1 = redTiles[i];
      const tile2 = redTiles[j];
      const delta = getCellDiff(tile1, tile2);
      const area = (Math.abs(delta.x) + 1) * (Math.abs(delta.y) + 1);

      if (area <= maxArea) {
        continue;
      }

      const rectangle = createRectangleFromTwoCorners(tile1, tile2);
      const rectangleLines = createLinesForClosedPath(rectangle);
      const rectangleLinesWithInsideDirections =
        addDirectionsToClosedPathLines(rectangleLines);
      const rectangleWithoutCorners =
        removeCornersFromRectangleLines(rectangleLines);

      const rectangleNoCornersWithLines: LineWithInsideDirection[] =
        rectangleLinesWithInsideDirections
          .map<LooseLineWithInsideDirection>((arr, index) => ({
            insideDirection: arr.insideDirection,
            line: rectangleWithoutCorners[index],
          }))
          .filter(isLineWithInsideDirection);

      let isBadArea = false;
      for (const rectangleLineWithDir of rectangleNoCornersWithLines) {
        for (let k = 0; k < borderLines.length && !isBadArea; ++k) {
          const intersects = determineIfLinesIntersect(
            rectangleLineWithDir.line,
            borderLines[k]
          );
          if (
            !intersects ||
            rectangleLineWithDir.insideDirection === undefined
          ) {
            continue;
          }

          const borderLineDirection = getLineDirection(borderLines[k]);
          const mustReverseBorder =
            !isLineACell(rectangleLineWithDir.line) &&
            isCellInLine(borderLines[k][1], rectangleLineWithDir.line);

          const properBorderLine = mustReverseBorder
            ? reverseLine(borderLineDirection)
            : borderLineDirection;

          const isBorderLineGoingInsideArea =
            rectangleLineWithDir.insideDirection === properBorderLine;

          if (isBorderLineGoingInsideArea) {
            isBadArea = true;
          }
        }
      }

      if (!isBadArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}
