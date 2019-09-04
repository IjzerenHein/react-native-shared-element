import { RNSharedElementNode } from "./RNSharedElementNode";

export class RNSharedElementNodeManager {
  private nodes = new Map<Element, RNSharedElementNode>();

  acquire(
    domNode: Element,
    isParent: boolean,
    ancestorDomNode: Element
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
