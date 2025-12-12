import { it, describe, expect } from 'vitest';
import {
  Cell,
  createLinesForClosedPath,
  determineIfLinesIntersect,
  isCellInArea,
  Line,
} from '../map';

describe('map helper', () => {
  describe('determineIfCellInArea', () => {
    type TestCase = {
      cell: Cell;
      area: [Cell, Cell];
      expectedValue: boolean;
    };
    const testCases: TestCase[] = [
      /**
       * ...C.
       * .AAAA
       * .AAAA
       */
      {
        cell: { x: 3, y: 0 },
        area: [
          { x: 1, y: 1 },
          { x: 4, y: 2 },
        ],
        expectedValue: false,
      },

      /**
       * .....
       * .AAAC
       * .AAAA
       */
      // #2
      {
        cell: { x: 4, y: 1 },
        area: [
          { x: 1, y: 1 },
          { x: 4, y: 2 },
        ],
        expectedValue: true,
      },
      // #3
      {
        cell: { x: 4, y: 1 },
        area: [
          { x: 4, y: 2 },
          { x: 1, y: 1 },
        ],
        expectedValue: true,
      },
      // #4
      {
        cell: { x: 4, y: 1 },
        area: [
          { x: 1, y: 2 },
          { x: 4, y: 1 },
        ],
        expectedValue: true,
      },
      // #5
      {
        cell: { x: 4, y: 1 },
        area: [
          { x: 4, y: 1 },
          { x: 1, y: 2 },
        ],
        expectedValue: true,
      },
    ];
    it.each(testCases)(
      'should determine if cell is in the area, %s',
      ({ cell, area, expectedValue }) => {
        const isInArea = isCellInArea(cell, area);
        expect(isInArea).toBe(expectedValue);
      }
    );
  });

  describe('determineIfLinesIntersect', () => {
    const intersectionTestData = {
      input: [
        { x: 2, y: 3 },
        { x: 7, y: 3 },
        { x: 7, y: 5 },
        { x: 2, y: 5 },
      ],
      lines: [
        {
          line: [
            { x: 2, y: 3 },
            { x: 7, y: 3 },
          ] satisfies Line,
          expectedIntersects: false,
        },
        {
          line: [
            { x: 6, y: 4 },
            { x: 8, y: 4 },
          ] satisfies Line,
          expectedIntersects: true,
        },
      ],
    };

    it.each(intersectionTestData.lines)(
      'can detect intersecting lines: $line',
      ({ line, expectedIntersects }) => {
        const areaLines = createLinesForClosedPath(intersectionTestData.input);
        const intersects = areaLines.some((areaLine) =>
          determineIfLinesIntersect(areaLine, line)
        );
        expect(intersects).toBe(expectedIntersects);
      }
    );
  });
});
