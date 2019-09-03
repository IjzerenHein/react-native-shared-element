import { RNSharedElementStyle } from "./RNSharedElementStyle";
import { RNSharedElementContent } from "./RNSharedElementContent";

export type RNSharedElementNodeStyleCallback = (style: RNSharedElementStyle, node: RNSharedElementNode) => void;
export type RNSharedElementNodeContentCallback = (content: RNSharedElementContent, node: RNSharedElementNode) => void;

export class RNSharedElementNode {
    public readonly domNode: Element;
    public readonly ancestorDomNode: Element;
    public readonly isParent: boolean;
    private hideRefCount: number = 0;
    private refCount: number = 1;
    private styleCache: RNSharedElementStyle | null = null;
    private styleCallbacks: RNSharedElementNodeStyleCallback[] | null = null;
    private contentCache: RNSharedElementContent | null = null;
    private contentCallbacks: RNSharedElementNodeContentCallback[] | null = null;
    
    constructor(domNode: Element, isParent: boolean, ancestorDomNode: Element) {
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
            //mHideAlpha = mView.getAlpha();
            //mView.setAlpha(0);
        }
    }

    releaseHideRef() {
        this.hideRefCount--;
        if (this.hideRefCount == 0) {
            //mView.setAlpha(mHideAlpha);
        }
    }

    requestStyle(callback: RNSharedElementNodeStyleCallback) {
        if (this.styleCache) {
            callback(this.styleCache, this);
            return;
        }
        this.styleCallbacks = this.styleCallbacks || [];
        this.styleCallbacks.push(callback);
        if (!this.fetchInitialStyle()) {
            //startRetryLoop();
        }
    }

    private fetchInitialStyle(): boolean {
         // TODO
         return false;
    }

    requestContent(callback: RNSharedElementNodeContentCallback) {
        if (this.contentCache) {
            callback(this.contentCache, this);
            return;
        }
        this.contentCallbacks = this.contentCallbacks || [];
        this.contentCallbacks.push(callback);
        if (!this.fetchInitialContent()) {
            //startRetryLoop();
        }
    }

    private fetchInitialContent(): boolean {
         // TODO
         return false;
    }
}