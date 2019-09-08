import {
  IHTMLElement,
  RNSharedElementAlign,
  RNSharedElementResize
} from "./types";
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

function createTransform(
  translateX: number = 0,
  translateY: number = 0,
  scaleX: number = 1,
  scaleY: number = 1
) {
  return `matrix3d(
    ${scaleX}, 0, 0, 0,
    0, ${scaleY}, 0, 0,
    0, 0, 1, 0,
    ${translateX}, ${translateY}, 0, 1
)`;
}

export class RNSharedElementView {
  public parentLayout: Rect = Rect.empty;
  // @ts-ignore
  public readonly element = initElement(document.createElement("div"));
  public layout: Rect = Rect.empty;
  public originalLayout: Rect = Rect.empty;
  public _contentElement: IHTMLElement | null = null;
  public contentLayout: Rect = Rect.empty;
  public resize: RNSharedElementResize = RNSharedElementResize.Auto;
  public align: RNSharedElementAlign = RNSharedElementAlign.Auto;

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
    const {
      layout,
      originalLayout,
      parentLayout,
      contentLayout,
      element
    } = this;
    if (layout.equals(Rect.empty)) return;

    // In case of images, run the resize algorithm
    if (!contentLayout.equals(layout)) {
      this.updateImageLayout();
      this.updateImageContentLayout();
      return;
    }

    // Update layout
    const { width, height } = originalLayout;
    const { x, y, width: scaledWidth, height: scaledHeight } = layout;

    // Update size
    const widthPx = width + "px";
    const heightPx = height + "px";
    const { style } = element;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;

    // Calculate translation
    const translateX = x - parentLayout.x;
    const translateY = y - parentLayout.y;

    // Calculate scale
    const scaleX = scaledWidth / width;
    const scaleY = scaledHeight / height;

    // Update transform matrix
    style.transform = createTransform(translateX, translateY, scaleX, scaleY);

    // Update content element
    const { style: contentStyle } = this._contentElement!;
    if (contentStyle.width !== widthPx) contentStyle.width = widthPx;
    if (contentStyle.height !== heightPx) contentStyle.height = heightPx;
    contentStyle.transform = createTransform();
  }

  private updateImageLayout() {
    const { layout, parentLayout, element } = this;
    const { x, y, width, height } = layout;

    // Update size
    const widthPx = width + "px";
    const heightPx = height + "px";
    const { style } = element;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;

    // Update transform
    const translateX = x - parentLayout.x;
    const translateY = y - parentLayout.y;
    style.transform = createTransform(translateX, translateY);
  }

  private updateImageContentLayout() {
    if (!this._contentElement) return;
    const { layout, contentLayout, parentLayout } = this;
    const { x, y, width, height } = contentLayout;

    // Update size
    const widthPx = width + "px";
    const heightPx = height + "px";
    const { style } = this._contentElement;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;

    // Update transform
    const translateX = x - (layout.x + parentLayout.x);
    const translateY = y - (layout.y + parentLayout.y);
    style.transform = createTransform(translateX, translateY);
  }
}
