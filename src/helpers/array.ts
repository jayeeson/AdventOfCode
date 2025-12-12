export function doInPlaceArrayItemSwap<T>(
  array: T[],
  first: number,
  second: number
) {
  if (
    first > array.length ||
    second > array.length ||
    first < 0 ||
    second < 0
  ) {
    throw new Error('out of bounds array access');
  }
  const tmp = array[first];
  array[first] = array[second];
  array[second] = tmp;
}

export function partition<
  T,
  TTrue extends string = 'true',
  TFalse extends string = 'false',
>(
  array: T[],
  predicate: (item: T) => boolean,
  keys?: { true?: TTrue; false?: TFalse }
): Record<TTrue | TFalse, T[]> {
  const trueKey = (keys?.true ?? 'true') as TTrue;
  const falseKey = (keys?.false ?? 'false') as TFalse;

  const result = {
    [trueKey]: [] as T[],
    [falseKey]: [] as T[],
  } as Record<TTrue | TFalse, T[]>;

  for (const item of array) {
    if (predicate(item)) {
      result[trueKey].push(item);
    } else {
      result[falseKey].push(item);
    }
  }

  return result;
}

type Primitive = string | number | boolean;
export function isArrayEqual<T extends Primitive>(arr1: T[], arr2: T[]) {
  if (arr1 === arr2) {
    return true;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function addArrayItemLengths<T extends Array<any>>(arr: T) {
  return arr.reduce((acc, cur) => {
    acc += cur.length;
    return acc;
  }, 0);
}
