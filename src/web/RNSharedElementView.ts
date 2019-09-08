import { IHTMLElement } from "./types";
import { Rect } from "./Rect";

function initElement(element: IHTMLElement): IHTMLElement {
  const { style } = element;
  style.position = "absolute";
  style.left = "0px";
  style.top = "0px";
  style.pointerEvents = "none";
  style.transformOrigin = "0% 0%";
  style.transformStyle = "preserve-3d";
  style.backfaceVisibility = "hidden";
  style.backgroundSize = "100% 100%";
  style.boxSizing = "border-box";
  style.overflow = "hidden";
  return element;
}

export class RNSharedElementView {
  private _parentLayout: Rect = Rect.empty;
  // @ts-ignore
  public readonly element = initElement(document.createElement("div"));
  private _layout: Rect = Rect.empty;
  private _contentElement: IHTMLElement | null = null;
  private _contentLayout: Rect = Rect.empty;

  get parentLayout(): Rect {
    return this._parentLayout;
  }
  set parentLayout(rect: Rect) {
    if (this._parentLayout.equals(rect)) return;
    this._parentLayout = rect;
    this.updateLayout();
  }

  get layout(): Rect {
    return this._layout;
  }
  set layout(rect: Rect) {
    if (this._layout.equals(rect)) return;
    this._layout = rect;
    this.updateLayout();
  }

  private updateLayout() {
    if (this._layout.equals(Rect.empty)) return;
    const { x, y, width, height } = this._layout;
    const widthPx = width + "px";
    const heightPx = height + "px";
    const { style } = this.element;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;
    const translateX = x - this._parentLayout.x;
    const translateY = y - this._parentLayout.y;
    const transform = `matrix3d(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            ${translateX}, ${translateY}, 0, 1
        )`;
    style.transform = transform;
  }

  get contentElement(): IHTMLElement | null {
    return this._contentElement;
  }
  set contentElement(value: IHTMLElement | null) {
    if (this._contentElement === value) return;
    if (this._contentElement) {
      this.element.removeChild(this._contentElement);
    }
    this._contentElement = value ? initElement(value) : null;
    if (this._contentElement) {
      this.element.appendChild(this._contentElement);
    }
    this.updateContentLayout();
  }

  get contentLayout(): Rect {
    return this._contentLayout;
  }
  set contentLayout(rect: Rect) {
    if (this._contentLayout.equals(rect)) return;
    this._contentLayout = rect;
    this.updateContentLayout();
  }

  private updateContentLayout() {
    if (!this._contentElement) return;
    const { x, y, width, height } = this._contentLayout;
    const widthPx = width + "px";
    const heightPx = height + "px";
    const { style } = this._contentElement;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;
    const translateX = x - (this._layout.x + this._parentLayout.x);
    const translateY = y - (this._layout.y + this._parentLayout.y);
    const transform = `matrix3d(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            ${translateX}, ${translateY}, 0, 1
        )`;
    style.transform = transform;
  }
}
