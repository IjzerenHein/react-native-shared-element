import { RNSharedElementContent } from "./RNSharedElementContent.web";
import { RNSharedElementStyle } from "./RNSharedElementStyle.web";
import { Rect } from "./Rect.web";
import { IHTMLElement } from "./types";

export type RNSharedElementNodeStyleCallback = (
  value: RNSharedElementStyle
) => void;
export type RNSharedElementNodeContentCallback = (
  value: RNSharedElementContent
) => void;

export class RNSharedElementNode {
  public readonly domNode: IHTMLElement;
  public readonly ancestorDomNode: IHTMLElement;
  public readonly isParent: boolean;
  private hideRefCount: number = 0;
  private hideOpacity: string | null = null;
  private refCount: number = 1;
  private styleCache: RNSharedElementStyle | null = null;
  private styleCallbacks: RNSharedElementNodeStyleCallback[] | null = null;
  private contentCache: RNSharedElementContent | null = null;
  private contentCallbacks: RNSharedElementNodeContentCallback[] | null = null;

  constructor(
    domNode: IHTMLElement,
    isParent: boolean,
    ancestorDomNode: IHTMLElement
  ) {
    this.domNode = domNode;
    this.isParent = isParent;
    this.ancestorDomNode = ancestorDomNode;
  }

  addRef() {
    return ++this.refCount;
  }

  releaseRef() {
    return --this.refCount;
  }

  addHideRef() {
    this.hideRefCount++;
    if (this.hideRefCount === 1) {
      const element = this.resolvedElement;
      this.hideOpacity = element!.style.opacity;
      element!.style.opacity = "0";
    }
  }

  releaseHideRef() {
    this.hideRefCount--;
    if (this.hideRefCount === 0) {
      const element = this.resolvedElement;
      // @ts-ignore
      element!.style.opacity = this.hideOpacity;
    }
  }

  get resolvedElement(): IHTMLElement | null {
    let element: IHTMLElement = this.domNode;

    // If this node is a parent, look for the first child
    if (this.isParent) {
      if (element.childNodes.length === 1) {
        // @ts-ignore
        element = element.childNodes[0];
      } else if (element.childNodes.length <= 0) {
        console.log("Child for parent doesnt exist");
        return null;
      }
    }

    // Get background-image node
    const { childNodes } = element;
    if (childNodes.length === 2) {
      for (let i = 0; i < 2; i++) {
        // @ts-ignore
        const childNode: IHTMLElement = childNodes[i];
        if (childNode.tagName === "IMG") {
          // @ts-ignore
          element = childNodes[i ? 0 : i + 1];
          break;
        }
      }
    }

    return element;
  }

  get resolvedAncestor(): IHTMLElement | null {
    return this.ancestorDomNode;
  }

  requestStyle(): Promise<RNSharedElementStyle> {
    if (this.styleCache) {
      return Promise.resolve(this.styleCache);
    }
    return new Promise((resolve) => {
      this.styleCallbacks = this.styleCallbacks || [];
      this.styleCallbacks.push(resolve);
      if (!this.fetchInitialStyle()) {
        console.debug("Failed to fetch style");
        //startRetryLoop();
      }
    });
  }

  private fetchInitialStyle(): boolean {
    const element = this.resolvedElement;
    const ancestor = this.resolvedAncestor;
    if (!element || !ancestor) return false;
    if (!this.styleCallbacks) return true;

    // Fetch layout
    const rect = element.getBoundingClientRect();
    // const ancestorTransform = ancestor.style.transform;
    const ancestorRect = ancestor.getBoundingClientRect();
    // console.log("ancestorTransform: ", ancestor.style, ancestorRect);
    const translateX = ancestorRect.x; // TODO
    const translateY = ancestorRect.y; // TODO
    const layout = new Rect({
      x: rect.x - translateX,
      y: rect.y - translateY,
      width: rect.width,
      height: rect.height,
    });

    // Create style
    const style = new RNSharedElementStyle(
      layout,
      // @ts-ignore
      window.getComputedStyle(element, null)
    );

    // console.debug("Style fetched: ", style);

    // Update cache
    this.styleCache = style;

    // Notify callbacks
    const callbacks = this.styleCallbacks;
    this.styleCallbacks = null;
    callbacks.forEach((callback) => callback(style));
    return true;
  }

  async requestContent(): Promise<RNSharedElementContent> {
    if (this.contentCache) return this.contentCache;

    return new Promise((resolve) => {
      if (this.contentCallbacks) return;
      this.contentCallbacks = this.contentCallbacks || [];
      this.contentCallbacks.push(resolve);
      this.fetchInitialContent();
      // TODO RETRY IN CASE OF FAILURE?
    });
  }

  private async fetchInitialContent(): Promise<boolean> {
    const element = this.resolvedElement;
    if (!element) return false;
    if (!this.contentCallbacks) return true;

    // Fetch content size
    const size = await RNSharedElementContent.getSize(element);
    if (!size) {
      return false;
    }

    // Create content
    const content = new RNSharedElementContent(element, size);

    // console.debug("Content fetched: ", content);

    // Update cache
    this.contentCache = content;

    // Notify callbacks
    const callbacks = this.contentCallbacks;
    this.contentCallbacks = null;
    callbacks.forEach((callback) => callback(content));
    return true;
  }
}
