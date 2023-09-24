export const rem = (n: number, c: number) => {
  if (isNaN(n)) n = 0;
  if (!isFinite(n)) n = 0;
  if (n > c - 1) return rem(n - c, c);
  if (n < 0) return rem(n + c, c);
  return n;
};

export const minMax = (n: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, n));
};