import { basename } from "library/basename";
import { writable } from "svelte/store";

export interface ISource {
  duration: number;
  buffer: ArrayBuffer;
  decodeBuffer: AudioBuffer;
}

export interface IMusic {
  name: string;
  url: string;
}

export const playlist = writable<IMusic[]>([]);
export const appendMusic = (name: string, url: string) => {
  playlist.update((old) => {
    return [...old, {
      name: basename(name),
      url,
    }];
  });
};
export const clearMusic = () => {
  playlist.set([]);
};