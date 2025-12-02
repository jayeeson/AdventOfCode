export const alwaysPositiveModulo = (value: number, modulo: number) => {
  return ((value % modulo) + modulo) % modulo;
};
