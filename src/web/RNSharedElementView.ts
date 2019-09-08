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
  private _originalLayout: Rect = Rect.empty;
  private _contentElement: IHTMLElement | null = null;
  private _contentLayout: Rect = Rect.empty;

  get parentLayout(): Rect {
    return this._parentLayout;
  }
  set parentLayout(rect: Rect) {
    if (this._parentLayout.equals(rect)) return;
    this._parentLayout = rect;
  }

  get layout(): Rect {
    return this._layout;
  }
  set layout(rect: Rect) {
    if (this._layout.equals(rect)) return;
    this._layout = rect;
  }

  get originalLayout(): Rect {
    return this._originalLayout;
  }
  set originalLayout(rect: Rect) {
    if (this._originalLayout.equals(rect)) return;
    this._originalLayout = rect;
  }

  get contentLayout(): Rect {
    return this._contentLayout;
  }
  set contentLayout(rect: Rect) {
    if (this._contentLayout.equals(rect)) return;
    this._contentLayout = rect;
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
  }

  public updateLayout() {
    if (this._layout.equals(Rect.empty)) return;

    // In case of images, run the resize algorithm
    if (!this._contentLayout.equals(this._layout)) {
      this.updateImageLayout();
      this.updateImageContentLayout();
      return;
    }

    // Update layout
    const { width, height } = this._originalLayout;
    const { x, y, width: scaledWidth, height: scaledHeight } = this._layout;

    // Update size
    const widthPx = width + "px";
    const heightPx = height + "px";
    const { style } = this.element;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;

    // Calculate translation
    const translateX = x - this._parentLayout.x;
    const translateY = y - this._parentLayout.y;

    // Calculate scale
    const scaleX = scaledWidth / width;
    const scaleY = scaledHeight / height;

    // Update matrix
    const transform = `matrix3d(
            ${scaleX}, 0, 0, 0,
            0, ${scaleY}, 0, 0,
            0, 0, 1, 0,
            ${translateX}, ${translateY}, 0, 1
        )`;
    style.transform = transform;

    // Update content element
    const { style: contentStyle } = this._contentElement!;
    if (contentStyle.width !== widthPx) contentStyle.width = widthPx;
    if (contentStyle.height !== heightPx) contentStyle.height = heightPx;
    const contentTransform = `matrix3d(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
  )`;
    contentStyle.transform = contentTransform;
  }

  private updateImageLayout() {
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

  private updateImageContentLayout() {
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
