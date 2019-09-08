import { IRect } from "./types";

export class Rect implements IRect {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  public static readonly empty = new Rect();

  constructor(source?: IRect) {
    if (source) {
      this.x = source.x;
      this.y = source.y;
      this.width = source.width;
      this.height = source.height;
    }
  }

  public equals(rect: Rect): boolean {
    return (
      this.x === rect.x &&
      this.y === rect.y &&
      this.width === rect.width &&
      this.height === rect.height
    );
  }
}
