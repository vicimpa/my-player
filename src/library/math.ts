export const rem = (n: number, c: number) => {
  if (isNaN(n)) n = 0;
  if (!isFinite(n)) n = 0;
  if (n > c - 1) return rem(n - c, c);
  if (n < 0) return rem(n + c, c);
  return n;
};