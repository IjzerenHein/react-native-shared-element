import { Rect } from "./Rect";

export class RNSharedElementContent {
  public readonly element: HTMLElement;
  public readonly size: Rect;

  constructor(element: HTMLElement, size: Rect) {
    this.element = element;
    this.size = size;
  }

  static getSize(element: any): Promise<Rect | null> {
    return new Promise((resolve, reject) => {
      if (element.style.backgroundImage) {
        // @ts-ignore
        const img = document.createElement("img");
        img.onload = () => {
          resolve(
            new Rect({
              x: 0,
              y: 0,
              width: img.width,
              height: img.height
            })
          );
        };
        img.onerror = (err: any) => reject(err);
        const url = element.style.backgroundImage;
        img.src = url.substring(5, url.length - 2);
      }
      resolve(
        new Rect({
          x: 0,
          y: 0,
          width: element.clientWidth || 0,
          height: element.clientHeight || 0
        })
      );
    });
  }
}
