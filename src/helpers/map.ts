/*
 *    Coordinate system
 *    ┌--------------> +x
 *    |
 *    |
 *    |
 *    |
 *    |
 *    v
 *    +y
 */

export interface Size {
  width: number;
  height: number;
}

export interface Cell {
  x: number;
  y: number;
}

export type CellTuple = [Cell, Cell];

export type MapLines = string[];

export type Line = [Cell, Cell];
export interface LineWithInsideDirection {
  line: Line;
  insideDirection: Direction4Points | undefined;
}
export type LooseLineWithInsideDirection = Omit<
  LineWithInsideDirection,
  'line'
> & {
  line: Line | undefined;
};

export enum Direction4Points {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum Direction8Points {
  NORTH,
  EAST,
  SOUTH,
  WEST,
  NORTHWEST,
  NORTHEAST,
  SOUTHEAST,
  SOUTHWEST,
  LENGTH,
}

export const castIntegerToDirection8 = (value: number): Direction8Points => {
  const ensureInteger = Math.trunc(value);
  if (ensureInteger < 0 || ensureInteger > 7 || isNaN(ensureInteger)) {
    throw new Error(`cannot convert integer to enum ${ensureInteger}`);
  }

  return ensureInteger as Direction8Points;
};

export const getMapSize = <T extends string | number[]>(input: T[]): Size => {
  if (input.length < 1 && input[0].length < 1) {
    throw new Error('input must have at least one row');
  }
  const widths = input.map((line) => line.length);
  const everyLineSameWidth = widths.every((width) => width === widths[0]);
  if (!everyLineSameWidth) {
    throw new Error('Map must be square');
  }

  return {
    width: widths[0],
    height: input.length,
  };
};

export const isInMap = (position: Cell, mapSize: Size): boolean => {
  if (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < mapSize.width &&
    position.y < mapSize.height
  ) {
    return true;
  }
  return false;
};

export const getCellDiff = (cell1: Cell, cell2: Cell): Cell => {
  return { x: cell2.x - cell1.x, y: cell2.y - cell1.y };
};

export const getCellOneAwayByDirection = (
  direction: Direction4Points | Direction8Points,
  position: Cell
) => {
  switch (direction) {
    case Direction8Points.NORTH:
      return { x: position.x, y: position.y - 1 };
    case Direction8Points.EAST:
      return { x: position.x + 1, y: position.y };
    case Direction8Points.SOUTH:
      return { x: position.x, y: position.y + 1 };
    case Direction8Points.WEST:
      return { x: position.x - 1, y: position.y };
    case Direction8Points.NORTHWEST:
      return { x: position.x - 1, y: position.y - 1 };
    case Direction8Points.NORTHEAST:
      return { x: position.x + 1, y: position.y - 1 };
    case Direction8Points.SOUTHEAST:
      return { x: position.x + 1, y: position.y + 1 };
    case Direction8Points.SOUTHWEST:
      return { x: position.x - 1, y: position.y + 1 };
    default:
      throw new Error('impossible direction');
  }
};

export const getDirectionFromNeighboringCell1ToCell2 = (
  cell1: Cell,
  cell2: Cell
): Direction4Points => {
  if (Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y) !== 1) {
    throw new Error('cells must be exactly one apart in x or y direction');
  }

  const diffX = cell2.x - cell1.x;
  if (diffX === 1) {
    return Direction4Points.EAST;
  }
  if (diffX === -1) {
    return Direction4Points.WEST;
  }

  const diffY = cell2.y - cell1.y;
  if (diffY === 1) {
    return Direction4Points.SOUTH;
  }
  if (diffY === -1) {
    return Direction4Points.NORTH;
  }
  throw new Error('you did something wrong');
};

export const getAdjacentCellDirection = (
  cell1: Cell,
  cell2: Cell
): Direction4Points => {
  const diffX = cell2.x - cell1.x;
  if (diffX > 0) {
    return Direction4Points.EAST;
  }
  if (diffX < 0) {
    return Direction4Points.WEST;
  }

  const diffY = cell2.y - cell1.y;
  if (diffY > 0) {
    return Direction4Points.SOUTH;
  }
  if (diffY < 0) {
    return Direction4Points.NORTH;
  }
  throw new Error('you did something wrong, cells are supposed to be adjacent');
};

export const cellToString = (cell: Cell) => {
  return `${cell.x}-${cell.y}`;
};

/** Does not validate input */
export const stringToCell = (input: string, delimiter: string = '-'): Cell => {
  const [x, y] = input.split(delimiter);
  return { x: Number(x), y: Number(y) };
};

export const createMoveString = (cell1: Cell, cell2: Cell) => {
  return `${cellToString(cell1)}-${cellToString(cell2)}`;
};

export const getAllPositions = (map: string[]): Cell[] => {
  const size = getMapSize(map);
  const positions: Cell[] = [];
  for (let i = 0; i < size.width; ++i) {
    for (let j = 0; j < size.height; ++j) {
      positions.push({ x: i, y: j });
    }
  }
  return positions;
};

export const drawOnMap = (
  { x, y }: Cell,
  map: MapLines,
  characterToDraw: string = 'X'
) => {
  if (characterToDraw.length !== 1) {
    throw new Error('must draw character with length 1');
  }
  const newLine =
    map[y].substring(0, x) + characterToDraw + map[y].substring(x + 1);
  map[y][x];
  map[y] = newLine;
};

/** sorts in place */
export function sortCoordinatesByIncreasingX(coordinates: Cell[]): Cell[] {
  const compareFunction = (a: Cell, b: Cell) => a.x - b.x;
  const sorted = coordinates.sort(compareFunction);
  return sorted;
}

export function findTopRightCornerCell(tiles: Cell[]) {
  let currentTopRightCellIndex: number = 0;
  if (tiles.length === 1) {
    return {
      index: 0,
      cell: tiles[0],
    };
  }

  for (let i = 1; i < tiles.length; ++i) {
    const delta = getCellDiff(tiles[i], tiles[currentTopRightCellIndex]);
    if (delta.x <= 0 && delta.y >= 0) {
      currentTopRightCellIndex = i;
    }
  }

  return {
    index: currentTopRightCellIndex,
    cell: tiles[currentTopRightCellIndex],
  };
}

export function isCellInArea(cell: Cell, area: [Cell, Cell]) {
  const delta = getCellDiff(area[0], area[1]);
  if (delta.x < 0) {
    if (delta.y < 0) {
      return (
        area[0].x >= cell.x &&
        area[1].x <= cell.x &&
        area[0].y >= cell.y &&
        area[1].y <= cell.y
      );
    }
    return (
      area[0].x >= cell.x &&
      area[1].x <= cell.x &&
      area[0].y <= cell.y &&
      area[1].y >= cell.y
    );
  }
  if (delta.y < 0) {
    return (
      area[0].x <= cell.x &&
      area[1].x >= cell.x &&
      area[0].y >= cell.y &&
      area[1].y <= cell.y
    );
  }
  return (
    area[0].x <= cell.x &&
    area[1].x >= cell.x &&
    area[0].y <= cell.y &&
    area[1].y >= cell.y
  );
}

export function isCellEqual(cell1: Cell, cell2: Cell) {
  const delta = getCellDiff(cell1, cell2);
  return delta.x === 0 && delta.y === 0;
}

export function isCellOneAwayIn4CardinalDirections(cell1: Cell, cell2: Cell) {
  const delta = getCellDiff(cell1, cell2);
  return Math.abs(delta.x) + Math.abs(delta.y) === 1;
}

/** Shape must close, i.e. last cell must be adjacent to the first cell */
export function createLinesForClosedPath(adjacentCells: Cell[]): Line[] {
  const lines: Line[] = [];
  for (let i = 0; i < adjacentCells.length; ++i) {
    const iPlus1 = (i + 1) % adjacentCells.length;
    const line: Line = [adjacentCells[i], adjacentCells[iPlus1]];
    lines.push(line);
  }
  return lines;
}

export function removeCornersFromRectangleLines(
  rectLines: Line[]
): Array<Line | undefined> {
  const lines: Array<Line | undefined> = [];

  for (let i = 0; i < rectLines.length; ++i) {
    const line = rectLines[i];
    if (getLineLength(line) <= 2) {
      lines.push(undefined);
    }

    const [cell1, cell2] = line;
    const direction = getLineDirection(line);

    switch (direction) {
      case Direction4Points.NORTH:
        lines.push([
          { x: cell1.x, y: cell1.y - 1 },
          { x: cell2.x, y: cell2.y + 1 },
        ]);
        break;
      case Direction4Points.SOUTH:
        lines.push([
          { x: cell1.x, y: cell1.y + 1 },
          { x: cell2.x, y: cell2.y - 1 },
        ]);
        break;
      case Direction4Points.EAST:
        lines.push([
          { x: cell1.x + 1, y: cell1.y },
          { x: cell2.x - 1, y: cell2.y },
        ]);
        break;
      case Direction4Points.WEST:
        lines.push([
          { x: cell1.x - 1, y: cell1.y },
          { x: cell2.x + 1, y: cell2.y },
        ]);
        break;
      default:
        throw new Error(
          'removeCornersFromRectangleLines: Rectangle must point in 1 of 4 cardinal directions'
        );
    }
  }
  return lines;
}

export function getLineDirection(line: Line): Direction4Points {
  return getAdjacentCellDirection(line[0], line[1]);
}

export function getLineLength(line: Line): number {
  const delta = getCellDiff(line[0], line[1]);
  if (delta.x !== 0 && delta.y !== 0) {
    throw new Error(
      'getLineLength: Lines must point in 1 of the 4 cardinal directions!'
    );
  }
  return Math.abs(delta.x) + Math.abs(delta.y) + 1;
}

export function addDirectionsToClosedPathLines(
  lines: Line[]
): LineWithInsideDirection[] {
  const linesWithDirections: LineWithInsideDirection[] = [];
  for (let i = 0; i < lines.length; ++i) {
    const iPlus1 = (i + 1) % lines.length;
    const insideDirection =
      lines.length === 1 || isCellEqual(lines[iPlus1][0], lines[iPlus1][1])
        ? undefined
        : getLineDirection(lines[iPlus1]);
    linesWithDirections.push({
      line: lines[i],
      insideDirection,
    });
  }
  return linesWithDirections;
}

export const isLineWithInsideDirection = (
  line: LooseLineWithInsideDirection
): line is LineWithInsideDirection => {
  return line.line !== undefined;
};

/** @returns  true if parallel, false if orthogonal */
export function areDirectionsParallel(
  direction1: Direction4Points | undefined,
  direction2: Direction4Points | undefined
): boolean | undefined {
  if (direction1 === undefined || direction2 === undefined) {
    return undefined;
  }

  const directionSum = direction1 + direction2;
  if (directionSum % 2 === 0) {
    return true;
  }
}

export function reverseLine(direction: Direction4Points): Direction4Points {
  return (direction + 2) % 4;
}

export function isLineACell(line: Line) {
  if (line === undefined) {
    console.log(line);
  }
  return isCellEqual(line[0], line[1]);
}

export function isCellInLine(cell: Cell, line: Line): boolean {
  const direction = getLineDirection(line);
  switch (direction) {
    case Direction4Points.NORTH:
      return cell.x === line[0].x && line[0].y >= cell.y && cell.y >= line[1].y;
    case Direction4Points.SOUTH:
      return cell.x === line[0].x && line[0].y <= cell.y && cell.y <= line[1].y;
    case Direction4Points.EAST:
      return cell.y === line[0].y && line[0].x <= cell.x && cell.x <= line[1].x;
    case Direction4Points.WEST:
      return cell.y === line[0].y && line[0].x >= cell.x && cell.x >= line[1].x;
    default:
      throw new Error('line must have a direction');
  }
}

export function determineIfLinesIntersect(line1: Line, line2: Line): boolean {
  const lineDirection1 = isLineACell(line1)
    ? undefined
    : getAdjacentCellDirection(line1[0], line1[1]);
  const lineDirection2 = isLineACell(line2)
    ? undefined
    : getAdjacentCellDirection(line2[0], line2[1]);

  if (areDirectionsParallel(lineDirection1, lineDirection2)) {
    return false;
  }

  const handleCaseWhereOneOrBothLinesAreCells = () => {
    if (lineDirection1 === undefined) {
      if (lineDirection2 === undefined) {
        return isCellEqual(line1[0], line2[0]);
      }
      return isCellInLine(line1[0], line2);
    }

    if (lineDirection2 === undefined) {
      if (lineDirection1 === undefined) {
        return isCellEqual(line2[0], line1[0]);
      }
      return isCellInLine(line2[0], line1);
    }
    return null;
  };

  const edgeCase = handleCaseWhereOneOrBothLinesAreCells();
  if (edgeCase !== null) {
    return edgeCase;
  }

  interface Info {
    stableX: number;
    yMin: number;
    yMax: number;
    stableY: number;
    xMin: number;
    xMax: number;
  }

  const { xMin, xMax, stableX, yMin, yMax, stableY } = [
    { line: line1, direction: lineDirection1 },
    { line: line2, direction: lineDirection2 },
  ].reduce((acc, { line, direction }) => {
    if (direction! % 2 === 0) {
      // N/S
      acc['stableX'] = line[0].x;
      acc['yMin'] = Math.min(line[0].y, line[1].y);
      acc['yMax'] = Math.max(line[0].y, line[1].y);
      return acc;
    }
    // E/W
    acc['stableY'] = line[0].y;
    acc['xMin'] = Math.min(line[0].x, line[1].x);
    acc['xMax'] = Math.max(line[0].x, line[1].x);
    return acc;
  }, {} as Info);

  return (
    xMin <= stableX && stableX <= xMax && yMin <= stableY && stableY <= yMax
  );
}

export function createRectangleFromTwoCorners(
  cell1: Cell,
  cell2: Cell
): Cell[] {
  if (cell1.x === cell2.x && cell1.y === cell2.y) {
    return [{ x: cell1.x, y: cell1.y }];
  }
  if (cell1.x === cell2.x) {
    return [
      { x: cell1.x, y: cell1.y },
      { x: cell1.x, y: cell2.y },
    ];
  }
  if (cell1.y === cell2.y) {
    return [
      { x: cell1.x, y: cell1.y },
      { x: cell2.x, y: cell1.y },
    ];
  }
  return [
    { x: cell1.x, y: cell1.y },
    { x: cell2.x, y: cell1.y },
    { x: cell2.x, y: cell2.y },
    { x: cell1.x, y: cell2.y },
  ];
}
