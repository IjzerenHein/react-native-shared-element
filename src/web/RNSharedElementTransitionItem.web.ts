import { RNSharedElementContent } from "./RNSharedElementContent.web";
import { RNSharedElementNode } from "./RNSharedElementNode.web";
import { RNSharedElementNodeManager } from "./RNSharedElementNodeManager.web";
import { RNSharedElementStyle } from "./RNSharedElementStyle.web";

export class RNSharedElementTransitionItem {
  private _hidden: boolean = false;
  public readonly name: string;
  private _node: RNSharedElementNode | null = null;
  private _nodeManager: RNSharedElementNodeManager;
  public needsStyle: boolean = false;
  public style: RNSharedElementStyle | null = null;
  public needsContent: boolean = false;
  public content: RNSharedElementContent | null = null;

  constructor(nodeManager: RNSharedElementNodeManager, name: string) {
    this._nodeManager = nodeManager;
    this.name = name;
  }

  get node(): RNSharedElementNode | null {
    return this._node;
  }
  set node(node: RNSharedElementNode | null) {
    if (this._node === node) {
      if (node != null) this._nodeManager.release(node);
      return;
    }
    if (this._node != null) {
      if (this._hidden) this._node.releaseHideRef();
      this._nodeManager.release(this._node);
    }
    this._node = node;
    this._hidden = false;
    this.needsStyle = node != null;
    this.style = null;
    this.needsContent = node != null;
    this.content = null;
  }

  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(hidden: boolean) {
    if (this._hidden === hidden) return;
    this._hidden = hidden;
    if (!this._node) return;
    if (hidden) {
      this._node.addHideRef();
    } else {
      this._node.releaseHideRef();
    }
  }
}
