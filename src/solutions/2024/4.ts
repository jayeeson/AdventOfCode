import { arrayIncludesDeep } from '../../helpers/deepEqual';
import { Cell, Direction8Points, Size } from '../../helpers/map';
import { readInput } from '../../helpers/readFile';

export function countFoundStringsInGrid(stringToFind: string, grid: string[]) {
  let found = 0;
  const width = grid.length;
  const height = grid[0].length;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      for (let dirIndex = 0; dirIndex < Direction8Points.LENGTH; ++dirIndex) {
        const functionInput: IPropsStringFromCoordinateAndDirection = {
          input: grid,
          cell: {
            x,
            y,
          },
          size: {
            width,
            height,
          },
          length: stringToFind.length,
          direction: dirIndex as Direction8Points,
        };
        const foundString =
          createStringFromCoordinateAndDirection(functionInput);
        if (foundString === stringToFind) {
          ++found;
        }
      }
    }
  }
  return found;
}

export interface IPropsStringFromCoordinateAndDirection {
  input: string[];
  size: Size;
  cell: Cell;
  length: number;
  direction: Direction8Points;
}

function reverseString(str: string) {
  const arr = str.split('');
  const reversed = arr.reverse();
  return reversed.join('');
}

export function createStringFromCoordinateAndDirection({
  input,
  size,
  cell,
  length,
  direction,
}: IPropsStringFromCoordinateAndDirection) {
  // WEST
  switch (direction) {
    case Direction8Points.WEST:
      if (cell.x >= length - 1) {
        const str = input[cell.y].slice(cell.x - 3, cell.x + 1);
        return reverseString(str);
      }
      break;
    case Direction8Points.EAST: {
      if (cell.x <= size.width - length) {
        return input[cell.y].slice(cell.x, cell.x + length);
      }
      break;
    }
    case Direction8Points.NORTH:
      if (cell.y >= length - 1) {
        let strArr = [];
        for (let i = 0; i < length; ++i) {
          strArr.push(input[cell.y - i][cell.x]);
        }
        return strArr.join('');
      }
      break;
    case Direction8Points.SOUTH:
      if (cell.y <= size.height - length) {
        let strArr = [];
        for (let i = 0; i < length; ++i) {
          strArr.push(input[cell.y + i][cell.x]);
        }
        return strArr.join('');
      }
      break;
    case Direction8Points.NORTHWEST:
      if (cell.x >= length - 1 && cell.y >= length - 1) {
        let strArr = [];
        for (let i = 0; i < length; ++i) {
          strArr.push(input[cell.y - i][cell.x - i]);
        }
        return strArr.join('');
      }
      break;
    case Direction8Points.NORTHEAST:
      if (cell.x <= size.width - length && cell.y >= length - 1) {
        let strArr = [];
        for (let i = 0; i < length; ++i) {
          strArr.push(input[cell.y - i][cell.x + i]);
        }
        return strArr.join('');
      }
      break;
    case Direction8Points.SOUTHWEST:
      if (cell.x >= length - 1 && cell.y <= size.height - length) {
        let strArr = [];
        for (let i = 0; i < length; ++i) {
          strArr.push(input[cell.y + i][cell.x - i]);
        }
        return strArr.join('');
      }
      break;
    case Direction8Points.SOUTHEAST:
      if (cell.x <= size.width - length && cell.y <= size.height - length) {
        let strArr = [];
        for (let i = 0; i < length; ++i) {
          strArr.push(input[cell.y + i][cell.x + i]);
        }
        return strArr.join('');
      }
      break;
    default:
      return undefined;
  }
  return undefined;
}

export async function solution4_1() {
  const fileInput = await readInput('../data/2024/4_input.txt');
  const grid = fileInput.split('\n');
  const numberXmases = countFoundStringsInGrid('XMAS', grid);
  return numberXmases;
}

export function countXShapedStringsInGrid(
  stringToFind: string,
  grid: string[]
) {
  let found = 0;
  const width = grid.length;
  const height = grid[0].length;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const functionInput: IPropsStringFromCoordinateAndDirection = {
        input: grid,
        cell: {
          x,
          y,
        },
        size: {
          width,
          height,
        },
        length: stringToFind.length,
        direction: Direction8Points.SOUTHEAST,
      };
      const foundString = createStringFromCoordinateAndDirection(functionInput);
      if (
        foundString === stringToFind ||
        foundString === reverseString(stringToFind)
      ) {
        const foundCounterMas = createStringFromCoordinateAndDirection({
          ...functionInput,
          cell: { x, y: y + 2 },
          direction: Direction8Points.NORTHEAST,
        });
        if (
          foundCounterMas === stringToFind ||
          foundCounterMas === reverseString(stringToFind)
        ) {
          ++found;
        }
      }
    }
  }
  return found;
}

export async function solution4_2() {
  const fileInput = await readInput('../data/2024/4_input.txt');
  const grid = fileInput.split('\n');
  const numberXmases = countXShapedStringsInGrid('MAS', grid);
  return numberXmases;
}
