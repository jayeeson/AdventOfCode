export const alwaysPositiveModulo = (value: number, modulo: number) => {
  return ((value % modulo) + modulo) % modulo;
};

export const addNumbers = (numbers: number[]) =>
  numbers.reduce((acc, cur) => acc + cur, 0);

export const multiplyNumbers = (numbers: number[]) =>
  numbers.reduce((acc, cur) => acc * cur, 1);
