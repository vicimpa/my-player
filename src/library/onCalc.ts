import { writable } from "svelte/store";

import { onFrame, runFrame } from "./onFrame";

import type { TFrameCallback } from "./onFrame";

export const onCalc = <T extends TFrameCallback>(callback: T) => {
  let lastValue: ReturnType<T> | undefined = undefined;

  const output = writable<ReturnType<T>>(runFrame(callback));

  onFrame((dtime, time) => {
    const result = callback(dtime, time);

    if (result !== lastValue) {
      output.set(result);
      lastValue = result;
    }
  });

  return output;
};