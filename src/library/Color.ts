import { rem } from "./math";

const CHECK_HEX = /^\#([0-9A-F]{3,})$/i;
const HEX_ALPHABET = '0123456789ABCDEF';

export class Color {
  r = 0;
  g = 0;
  b = 0;

  // #fff
  // #ffff
  // #ffffff
  // #ffffffff

  static fromHex(string: string) {
    const match = CHECK_HEX.exec(string.toUpperCase());

    if (!match)
      throw new Error('Unknow format');

    const [, hex] = match;
    const newColor = new Color();

    switch (hex.length) {
      case 3:
      case 4: {
        const [r, g, b] = hex;
        newColor.r = parseInt(r + r, 16);
        newColor.g = parseInt(g + g, 16);
        newColor.b = parseInt(b + b, 16);
        break;
      }

      case 6:
      case 8: {
        const [r1, r2, g1, g2, b1, b2] = hex;
        newColor.r = parseInt(r1 + r2, 16);
        newColor.g = parseInt(g1 + g2, 16);
        newColor.b = parseInt(b1 + b2, 16);
        break;
      }

      default:
        throw new Error('Unknow format');
    }

    return newColor;
  }

  constructor(r: number = 0, g: number = r, b: number = g) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  *[Symbol.iterator]() {
    yield this.r;
    yield this.g;
    yield this.b;
  }

  toString() {
    const { r, g, b } = this;
    return `rgb(${r & 0xFF}, ${g & 0xFF}, ${b & 0xFF})`;
  }

  toHex() {
    let output = '#';

    for (const v of this) {
      output += HEX_ALPHABET[v >> 4];
      output += HEX_ALPHABET[v & 0xF];
    }

    return output;
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b);
  }

  plus(color: Color | number): Color {
    if (typeof color === 'number')
      color = new Color(color);

    this.r += color.r;
    this.g += color.g;
    this.b += color.b;

    return this;
  }

  cplus(color: Color | number): Color {
    return this.clone().plus(color);
  }

  minus(color: Color | number): Color {
    if (typeof color === 'number')
      color = new Color(color);

    this.r -= color.r;
    this.g -= color.g;
    this.b -= color.b;

    return this;
  }

  cminus(color: Color | number): Color {
    return this.clone().minus(color);
  }

  times(color: Color | number): Color {
    if (typeof color === 'number')
      color = new Color(color);

    this.r *= color.r;
    this.g *= color.g;
    this.b *= color.b;

    return this;
  }

  ctimes(color: Color | number): Color {
    return this.clone().times(color);
  }

  div(color: Color | number): Color {
    if (typeof color === 'number')
      color = new Color(color);

    this.r /= color.r;
    this.g /= color.g;
    this.b /= color.b;

    return this;
  }

  cdiv(color: Color | number): Color {
    return this.clone().div(color);
  }

  rem(color: Color | number): Color {
    if (typeof color === 'number')
      color = new Color(color);

    this.r = rem(this.r, color.r);
    this.g = rem(this.g, color.g);
    this.b = rem(this.b, color.b);

    return this;
  }

  crem(color: Color | number): Color {
    return this.clone().rem(color);
  }

}