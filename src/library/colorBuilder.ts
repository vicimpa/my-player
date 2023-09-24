import { minMax } from "./math";

import type { Color } from "./Color";
export type TColor = {
  color: Color;
  weight: number;
};

// 0000111222 / 10
// 0 - 1

export const makeColorBuilder = (colors: TColor[]) => {
  const last = colors.at(-1);
  colors = colors.map(e => ({ ...e }));

  let max = 0;

  colors.reduce((s, e) => {
    const r = s + e.weight;
    max = e.weight = s;
    return r;
  }, 0);

  last.weight += max;
  colors.push(last);

  return (n: number) => {
    n = minMax(n, 0, 1) * max;
    const index = colors.findLastIndex(e => e.weight <= n)!;
    const start = colors[index]!;
    const end = colors[index + 1]!;
    const delta = end.weight - start.weight;
    const dColor = end.color.cminus(start.color);
    let value = (n - start.weight) / delta;
    if (isNaN(value)) value = 0;
    dColor.times(value);
    return start.color.cplus(dColor);
  };
};