import { minMax } from "./math";

export type TColor = {
  color: [r: number, g: number, b: number];
  weight: number;
};

export const makeColorBuilder = (colors: TColor[]) => {
  const last = colors.at(-1);
  colors = colors.map(e => ({ ...e }));
  colors.push(last);

  let max = 0;

  colors.reduce((s, e) => {
    const r = s + e.weight;
    max = e.weight = s;
    return r;
  }, 0);


  return (n: number) => {
    n = minMax(n, 0, 1) * max;
    const index = colors.findLastIndex(e => e.weight <= n)!;
    const start = colors[index]!;
    const end = colors[index + 1] ?? start;
    const [a1, b1, c1] = start.color;
    const [a2, b2, c2] = end.color;
    const [a, b, c] = [a2 - a1, b2 - b1, c2 - c1];
    const delta = end.weight - start.weight;
    let value = (n - start.weight) / delta;
    if (isNaN(value)) value = 0;
    return [a1 + a * value, b1 + b * value, c1 + c * value] as [r: number, g: number, b: number];
  };
};