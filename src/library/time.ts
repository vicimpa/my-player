import { col } from "./col";

export const time = (n: number) => {
  if (isNaN(n)) n = 0;
  return `${col(n / 60 | 0)}:${col(n % 60 | 0)}`;
};