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
