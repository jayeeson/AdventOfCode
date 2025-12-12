import { it, describe, expect } from 'vitest';
import {
  convertInputToRedTileCoordinates,
  createExitBorderMapObject,
  findLargestAreaWithoutCrossingBorderSlow,
  findLargestAreaWithoutCrossingBorderFast,
  findLargestRectangleArea,
} from '../../src/solutions/2025/9';
import {
  Cell,
  createLinesForClosedPath,
  findTopRightCornerCell,
  sortCoordinatesByIncreasingX,
  stringToCell,
} from '../../src/helpers/map';

const testData = {
  input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
  expectedLargestAreaCoordinates: [
    [2, 5],
    [11, 1],
  ],
  expectedLargestAreaSize: 50,
  expectedLargestGreenArea: 24,
  topRightCell: {
    cell: '11,1',
    index: 1,
  },
  expectedRedGreenBorder: `..............
.......#XXX#..
.......X...X..
..#XXXX#...X..
..X........X..
..#XXXXXX#.X..
.........X.X..
.........#X#..
..............`,
};

describe('day 9 2025', () => {
  const findNonEmptyCells = (input: string) => {
    const lines = input.split('\n');
    const chars = lines.map((line) => line.split(''));
    const borderCells: Cell[] = [];
    for (let i = 0; i < chars.length; ++i) {
      for (let j = 0; j < chars[0].length; ++j) {
        if (chars[i][j] !== '.') {
          borderCells.push({ x: j, y: i });
        }
      }
    }
    return borderCells;
  };

  describe('BRUTE FORCE 🕑🕑🕑😴😴😴', () => {
    it('Should be able to find coordinates of largest area', () => {
      const redTileCoordinates = convertInputToRedTileCoordinates(
        testData.input
      );
      const sortedTiles = sortCoordinatesByIncreasingX(redTileCoordinates);
      const largestArea = findLargestRectangleArea(sortedTiles);
      expect(largestArea).toBe(testData.expectedLargestAreaSize);
    });

    it('can find top right cell', () => {
      const redTileCoordinates = convertInputToRedTileCoordinates(
        testData.input
      );
      const topRightCell = findTopRightCornerCell(redTileCoordinates);
      expect(topRightCell).toMatchObject({
        cell: stringToCell(testData.topRightCell.cell, ','),
        index: testData.topRightCell.index,
      });
    });

    it('should be able to follow the path ', () => {
      const redTileCoordinates = convertInputToRedTileCoordinates(
        testData.input
      );
      const cornerCell = findTopRightCornerCell(redTileCoordinates);
      const exitBorderMap = createExitBorderMapObject(
        redTileCoordinates,
        cornerCell.index
      );
      const borderCells = Object.values(exitBorderMap).map((o) => o.cell);
      const expectedBorderCells = findNonEmptyCells(
        testData.expectedRedGreenBorder
      );
      expect(borderCells).toEqual(expect.arrayContaining(expectedBorderCells));
    });

    it('Should be able to find coordinates of largest area with green inside via BRUTE FORCE', () => {
      const redTileCoordinates = convertInputToRedTileCoordinates(
        testData.input
      );
      const cornerCell = findTopRightCornerCell(redTileCoordinates);
      const exitBorderMap = createExitBorderMapObject(
        redTileCoordinates,
        cornerCell.index
      );
      const largestArea = findLargestAreaWithoutCrossingBorderSlow(
        redTileCoordinates,
        exitBorderMap
      );
      expect(largestArea).toBe(testData.expectedLargestGreenArea);
    });
  });

  describe('INTERSECTING LINE METHOD', () => {
    it('Should be able to find coordinates of largest area with green inside via INTERSECTION LINES: $expectedLargestGreenArea', () => {
      const redTiles = convertInputToRedTileCoordinates(testData.input);
      const areaLines = createLinesForClosedPath(redTiles);
      const largestArea = findLargestAreaWithoutCrossingBorderFast(
        redTiles,
        areaLines
      );
      expect(largestArea).toBe(testData.expectedLargestGreenArea);
    });
  });
});
