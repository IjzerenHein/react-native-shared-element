import { RNSharedElementNode } from "./RNSharedElementNode";

export class RNSharedElementNodeManager {
  private nodes = new Map<HTMLElement, RNSharedElementNode>();
  private static instance: RNSharedElementNodeManager;

  static getInstance(): RNSharedElementNodeManager {
    if (!RNSharedElementNodeManager.instance) {
      RNSharedElementNodeManager.instance = new RNSharedElementNodeManager();
    }
    return RNSharedElementNodeManager.instance;
  }

  acquire(
    domNode: HTMLElement,
    isParent: boolean,
    ancestorDomNode: HTMLElement
  ): RNSharedElementNode {
    let node = this.nodes.get(domNode);
    if (node) {
      node.addRef();
      return node;
    }
    node = new RNSharedElementNode(domNode, isParent, ancestorDomNode);
    this.nodes.set(domNode, node);
    return node;
  }

  release(node: RNSharedElementNode) {
    const refCount = node.releaseRef();
    if (!refCount) {
      this.nodes.delete(node.domNode);
    }
    return refCount;
  }
}
