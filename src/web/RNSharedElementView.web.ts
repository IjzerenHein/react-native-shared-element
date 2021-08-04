import { RNSharedElementStyle } from "./RNSharedElementStyle.web";
import { Rect } from "./Rect.web";
import {
  IHTMLElement,
  RNSharedElementAlign,
  RNSharedElementResize,
} from "./types";

function initElement(element: IHTMLElement): IHTMLElement {
  const { style } = element;

  // Reset default layout behavior
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

  // Clear styles
  // style.backgroundColor = null;

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
  public readonly element = initElement(document.createElement("div"));
  public layout: Rect = Rect.empty;
  public style: RNSharedElementStyle | null = null;
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
    const { layout, contentLayout, resize } = this;
    if (layout.equals(Rect.empty)) return;

    // Run either the stretch (scale) or resize algorithm
    if (
      resize === RNSharedElementResize.Stretch ||
      (resize === RNSharedElementResize.Auto && contentLayout.equals(layout))
    ) {
      this.updateLayoutForScale();
    } else {
      this.updateLayoutForResize();
    }

    // Update style
    this.updateStyle();
  }

  /**
   * Updates the layout by only changing the scale of the
   * element. This technique achieves a very high performance
   * as it can be handled completely by the GPU, requiring
   * no layout passes in the browser. It is however also more
   * limited and can't be used for all effects.
   */
  private updateLayoutForScale() {
    const { layout, originalLayout, parentLayout, element } = this;

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

  /**
   * Updates the layout by updating the size of the
   * element and its content element. This algorihm
   * can achieve any possible layout, as well as
   * clipping of the content.
   */
  private updateLayoutForResize() {
    const {
      layout,
      parentLayout,
      element,
      contentLayout,
      originalLayout,
      align,
      resize,
    } = this;
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

    // Content
    if (!this._contentElement) return;
    let {
      x: contentX,
      y: contentY,
      width: contentWidth,
      height: contentHeight,
    } = contentLayout;

    // Get content size
    let overflow = "hidden";
    switch (resize) {
      case RNSharedElementResize.Auto:
        // keep original size
        break;
      case RNSharedElementResize.Stretch:
        contentWidth = width;
        contentHeight = height;
        break;
      case RNSharedElementResize.Clip:
        contentWidth = originalLayout.width;
        contentHeight = originalLayout.height;
        break;
      case RNSharedElementResize.None:
        contentWidth = originalLayout.width;
        contentHeight = originalLayout.height;
        overflow = "visible";
        break;
    }

    // Align
    switch (align) {
      case RNSharedElementAlign.LeftTop:
        contentX = 0;
        contentY = 0;
        break;
      case RNSharedElementAlign.LeftCenter:
        contentX = 0;
        contentY = (height - contentHeight) / 2;
        break;
      case RNSharedElementAlign.LeftBottom:
        contentX = 0;
        contentY = height - contentHeight;
        break;
      case RNSharedElementAlign.RightTop:
        contentX = width - contentWidth;
        contentY = 0;
        break;
      case RNSharedElementAlign.RightCenter:
        contentX = width - contentWidth;
        contentY = (height - contentHeight) / 2;
        break;
      case RNSharedElementAlign.RightBottom:
        contentX = width - contentWidth;
        contentY = height - contentHeight;
        break;
      case RNSharedElementAlign.CenterTop:
        contentX = (width - contentWidth) / 2;
        contentY = 0;
        break;
      case RNSharedElementAlign.Auto:
      case RNSharedElementAlign.CenterCenter:
        contentX = (width - contentWidth) / 2;
        contentY = (height - contentHeight) / 2;
        break;
      case RNSharedElementAlign.CenterBottom:
        contentX = (width - contentWidth) / 2;
        contentY = height - contentHeight;
        break;
    }

    // Update content size
    const contentWidthPx = contentWidth + "px";
    const contentHeightPx = contentHeight + "px";
    const { style: contentStyle } = this._contentElement;
    if (contentStyle.width !== widthPx) contentStyle.width = contentWidthPx;
    if (contentStyle.height !== heightPx) contentStyle.height = contentHeightPx;

    // Update content transform
    contentStyle.transform = createTransform(contentX, contentY);

    // Update overflow
    if (element.style.overflow !== overflow) {
      element.style.overflow = overflow;
    }
  }

  private updateStyle() {
    //const { style, element } = this;
    //if (!style) return;
    // element.style.backgroundColor = formatColor(style.backgroundColor);
  }
}
