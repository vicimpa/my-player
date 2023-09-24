import { onDestroy, onMount } from "svelte";

export type TFrameCallback = (dtime: number, time: number) => any;

const frames = new Set<TFrameCallback>();

let lastTime = -1;
let dtime = 0;

const loop = (time: number) => {
  requestAnimationFrame(loop);

  if (lastTime < 0) lastTime = time;
  dtime = time - lastTime;
  lastTime = time;

  for (const frame of frames)
    runFrame(frame);
};

requestAnimationFrame(loop);

export const runFrame = <T extends TFrameCallback>(
  frame: T
): ReturnType<T> => frame(dtime, lastTime);

export const onFrame = (callback: TFrameCallback) => {
  callback(0, lastTime);
  onMount(() => frames.add(callback));
  onDestroy(() => frames.delete(callback));
};