import { Direction } from 'readline';
import path from 'path';
import { sumOfArray } from './1';
import { readInput, splitStringAtEOL } from '../../helpers/readFile';
import { deepEqual } from '../../helpers/deepEqual';
import { Cell, Direction4Points, MapLines } from '../../helpers/map';

export interface GuardPosition {
  position: Cell;
  exit?: boolean;
  isLooping?: boolean;
}

export const getGuardPosition = (mapLines: MapLines): Cell | null => {
  for (let i = 0; i < mapLines.length; ++i) {
    const found = mapLines[i].search(/[\^><v]/);
    if (found >= 0) {
      return { x: found, y: i };
    }
  }
  return null;
};

export const inferDirection = (position: Cell | null, mapLines: MapLines) => {
  if (position === null) {
    return null;
  }
  const directionSymbol = mapLines[position.y].at(position.x);
  switch (directionSymbol) {
    case '^':
      return Direction4Points.NORTH;
    case '>':
      return Direction4Points.EAST;
    case 'v':
      return Direction4Points.SOUTH;
    case '<':
      return Direction4Points.WEST;
    default:
      throw new Error('Impossible case...');
  }
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

export const findNextObstacleOrExitAndUpdateMap = (
  direction: Direction4Points,
  position: Cell,
  mapLines: MapLines,
  obstacleChar: string = '#'
): GuardPosition => {
  if (obstacleChar.length !== 1) {
    throw new Error('obstacle char must be length 1');
  }
  // initial position...
  drawOnMap({ ...position }, mapLines);

  switch (direction) {
    case Direction4Points.NORTH: {
      for (let y = position.y; y >= 0; --y) {
        if (y - 1 < 0) {
          return { position: { x: position.x, y }, exit: true };
        }
        if (mapLines[y - 1].at(position.x) === obstacleChar) {
          return { position: { x: position.x, y } };
        }
        drawOnMap({ x: position.x, y: y - 1 }, mapLines);
      }
      throw new Error("shouldn't fall through NORTH");
    }
    case Direction4Points.SOUTH: {
      for (let y = position.y; y < mapLines.length; ++y) {
        if (y + 1 === mapLines.length) {
          return { position: { x: position.x, y }, exit: true };
        }
        if (mapLines[y + 1].at(position.x) === obstacleChar) {
          return { position: { x: position.x, y } };
        }
        drawOnMap({ x: position.x, y: y + 1 }, mapLines);
      }
      throw new Error("shouldn't fall through SOUTH");
    }
    case Direction4Points.EAST: {
      for (let x = position.x; x < mapLines[0].length; ++x) {
        if (x + 1 === mapLines[0].length) {
          return { position: { x, y: position.y }, exit: true };
        }
        if (mapLines[position.y].at(x + 1) === obstacleChar) {
          return { position: { x, y: position.y } };
        }
        drawOnMap({ x: x + 1, y: position.y }, mapLines);
      }
      throw new Error("shouldn't fall through EAST");
    }
    case Direction4Points.WEST: {
      for (let x = position.x; x >= 0; --x) {
        if (x - 1 < 0) {
          return { position: { x, y: position.y }, exit: true };
        }
        if (mapLines[position.y].at(x - 1) === obstacleChar) {
          return { position: { x, y: position.y } };
        }
        drawOnMap({ x: x - 1, y: position.y }, mapLines);
      }
      throw new Error("shouldn't fall through WEST");
    }
    default:
      throw new Error(
        `unhandled case? direction=${direction}, position: {${position.x},${position.y}}`
      );
  }
};

export const getNextDirection = (
  direction: Direction4Points
): Direction4Points => {
  const directionAsNumber = direction as number;
  const nextDirectionAsNumber = (directionAsNumber + 1) % 4;
  if (nextDirectionAsNumber < 0 || nextDirectionAsNumber > 3) {
    throw new Error(`Impossible direction, ${nextDirectionAsNumber}`);
  }
  return nextDirectionAsNumber as Direction4Points;
};

export const drawMaxLinePath = (
  mapLines: MapLines,
  maxCount: number = 1000
) => {
  let position = getGuardPosition(mapLines);
  let direction = inferDirection(position, mapLines);
  const positionDirectionSet: Record<string, Direction4Points[]> = {};

  for (let counter = 0; counter < maxCount; ++counter) {
    if (direction === null || !position) {
      return {
        mapLines,
        isLooping: false,
      };
    }
    const newGuardPosition = findNextObstacleOrExitAndUpdateMap(
      direction,
      position,
      mapLines
    );
    if (newGuardPosition.exit) {
      return {
        mapLines,
        isLooping: false,
        exit: true,
      };
    }

    const positionString = `${newGuardPosition.position.x},${newGuardPosition.position.y}`;
    if (positionString in positionDirectionSet) {
      if (positionDirectionSet[positionString].includes(direction)) {
        return {
          mapLines,
          isLooping: true,
        };
      }
      positionDirectionSet[positionString].push(direction);
    } else {
      positionDirectionSet[positionString] = [direction];
    }

    direction = getNextDirection(direction);
    position = newGuardPosition.position;
  }
};

export const countNumberFinalGuardPositions = (
  map: MapLines,
  pathCharacters: string[] = ['X']
) => {
  if (pathCharacters.some((c) => c.length !== 1)) {
    throw new Error('path character must be length 1');
  }
  const countArray = map.map((line) => {
    let countOnThisLine = 0;
    for (let i = 0; i < line.length; ++i) {
      if (pathCharacters.includes(line[i])) {
        ++countOnThisLine;
      }
    }
    return countOnThisLine;
  });
  return sumOfArray(countArray);
};

export const solution6_1 = async () => {
  const input = await readInput('../data/2024/6_input.txt');
  const lines = splitStringAtEOL(input);
  drawMaxLinePath(lines);
  const numberPositions = countNumberFinalGuardPositions(lines);
  return numberPositions;
};

export const findNumberOfLoopablePositions = (
  mapLines: MapLines,
  maxCount: number = 200,
  write?: boolean
) => {
  let totalLoopablePositions = 0;
  const position = getGuardPosition(mapLines);
  for (let i = 0; i < mapLines[0].length; ++i) {
    for (let j = 0; j < mapLines.length; ++j) {
      if (deepEqual(position, { x: i, y: j })) {
        continue;
      }
      const tempMap = mapLines.slice();
      drawOnMap({ x: i, y: j }, tempMap, '#');
      const newMap = drawMaxLinePath(tempMap, maxCount);
      if (newMap === undefined) {
        throw new Error(" didn't expect to reach end of counter");
      }
      if (newMap.isLooping) {
        ++totalLoopablePositions;
      }
    }
  }
  return totalLoopablePositions;
};

export const solution6_2 = async () => {
  const input = await readInput('../data/2024/6_input.txt');
  const lines = splitStringAtEOL(input);
  const maxCount = input.length;
  const numberLoopablePositions = findNumberOfLoopablePositions(
    lines,
    maxCount
  );
  return numberLoopablePositions;
};
