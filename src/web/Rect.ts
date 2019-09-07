export interface IRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export class Rect implements IRect {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  constructor(source?: IRect) {
    if (source) {
      this.x = source.x;
      this.y = source.y;
      this.width = source.width;
      this.height = source.height;
    }
  }
}
