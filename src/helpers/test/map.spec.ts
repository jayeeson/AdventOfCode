import { it, describe, expect } from 'vitest';
import { Cell, isCellInArea } from '../map';

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
});
