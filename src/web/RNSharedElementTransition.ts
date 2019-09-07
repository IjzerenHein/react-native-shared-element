import { RNSharedElementTransitionItem } from "./RNSharedElementTransitionItem";
// import { RNSharedElementNode } from "./RNSharedElementNode";
import { RNSharedElementNodeManager } from "./RNSharedElementNodeManager";
import {
  RNSharedElementNodeConfig,
  RNSharedElementAnimation,
  RNSharedElementResize,
  RNSharedElementAlign
} from "./types";
import { Rect } from "./Rect";
import { RNSharedElementStyle } from "./RNSharedElementStyle";
import { RNSharedElementContent } from "./RNSharedElementContent";

const EMPTY_RECT = new Rect();

export class RNSharedElementTransition {
  private items = [
    new RNSharedElementTransitionItem(
      RNSharedElementNodeManager.getInstance(),
      "start"
    ),
    new RNSharedElementTransitionItem(
      RNSharedElementNodeManager.getInstance(),
      "end"
    )
  ];
  public animation: RNSharedElementAnimation = RNSharedElementAnimation.Move;
  public resize: RNSharedElementResize = RNSharedElementResize.Auto;
  public align: RNSharedElementAlign = RNSharedElementAlign.Auto;
  public nodePosition: number = 0;
  public element: HTMLElement | null = null;
  private childElements: (HTMLElement | null)[] = [null, null];

  public destroy() {
    this.element = null;
    this.items.forEach(item => (item.node = null));
  }

  public setNode(
    end: boolean,
    node: RNSharedElementNodeConfig | null,
    ancestor: RNSharedElementNodeConfig | null
  ) {
    this.items[end ? 1 : 0].node =
      node && ancestor
        ? RNSharedElementNodeManager.getInstance().acquire(
            node.nodeHandle,
            node.isParent,
            ancestor.nodeHandle
          )
        : null;
  }

  public didSetProps() {
    this.requestStylesAndContent();
    this.updateLayout();
    this.updateNodeVisibility();
  }

  private requestStylesAndContent() {
    this.items.forEach(item => {
      if (item.needsStyle) {
        item.needsStyle = false;
        item.node!.requestStyle().then(style => {
          item.style = style;
          this.updateLayout();
        });
      }
      if (item.needsContent) {
        item.needsContent = false;
        item.node!.requestContent().then(content => {
          item.content = content;
          this.updateLayout();
        });
      }
    });
  }

  private updateNodeVisibility() {
    const { items, animation } = this;
    items.forEach(item => {
      let hidden = item.style && item.content ? true : false;
      if (
        hidden &&
        animation === RNSharedElementAnimation.FadeIn &&
        item.name === "start"
      )
        hidden = false;
      if (
        hidden &&
        animation === RNSharedElementAnimation.FadeOut &&
        item.name === "end"
      )
        hidden = false;
      item.hidden = hidden;
    });
  }

  private updateLayout() {
    const {
      element,
      items,
      nodePosition /*, animation, resize, align*/
    } = this;
    if (!element) return;

    // Get styles
    const startStyle = items[0].style;
    const endStyle = items[1].style;
    if (!startStyle && !endStyle) return;

    // Get content
    let startContent = items[0].content;
    // const endContent = items[1].content;
    /*if ((animation == RNSharedElementAnimation.Move) && !startContent && endContent != null) {
      startContent = endContent;
    }*/

    // Get layout
    const startLayout = startStyle ? startStyle.layout : EMPTY_RECT;
    const endLayout = endStyle ? endStyle.layout : EMPTY_RECT;

    // TODO CLIPPING

    // Get interpolated layout
    let interpolatedLayout: Rect = startLayout;
    let interpolatedStyle: RNSharedElementStyle = startStyle!;
    // let interpolatedClipInsets: Rect = EMPTY_RECT;
    if (startStyle && endStyle) {
      interpolatedLayout = RNSharedElementStyle.getInterpolatedLayout(
        startLayout,
        endLayout,
        nodePosition
      );
      // interpolatedClipInsets = getInterpolatedClipInsets(parentLayout, startClipInsets, startClippedLayout, endClipInsets, endClippedLayout, mNodePosition);
      interpolatedStyle = RNSharedElementStyle.getInterpolatedStyle(
        startStyle,
        endStyle,
        nodePosition
      );
    } else if (startStyle) {
      interpolatedLayout = startLayout;
      interpolatedStyle = startStyle;
      // interpolatedClipInsets = startClipInsets;
    } else {
      interpolatedLayout = endLayout;
      interpolatedStyle = endStyle!;
      // interpolatedClipInsets = endClipInsets;
    }

    this.updateChildElement(
      0,
      interpolatedLayout,
      interpolatedStyle,
      startLayout,
      startContent
    );
  }

  private updateChildElement(
    index: number,
    interpolatedLayout: Rect,
    // @ts-ignore
    interpolatedStyle: RNSharedElementStyle,
    // @ts-ignore
    originalLayout: Rect,
    content: RNSharedElementContent | null
  ) {
    const { element, childElements } = this;
    let childElement: any = childElements[index];

    // If the child-element does not yet exist, then clone it and add it to the DOM
    const widthPx = interpolatedLayout.width + "px";
    const heightPx = interpolatedLayout.height + "px";
    if (!childElement) {
      if (!content || !content.element) return;
      childElement = (content.element as any).cloneNode(true);
      childElements[index] = childElement;
      (element as any).appendChild(childElement);
      const { style } = childElement;
      style.position = "absolute";
      style.left = "0px";
      style.top = "0px";
      style.width = widthPx;
      style.height = heightPx;
      style.pointerEvents = "none";
      style.transformOrigin = "0% 0%";
      style.transformStyle = "preserve-3d";
      style.backfaceVisibility = "hidden";
      style.boxSizing = "border-box";
    }

    // Update layout
    const { style } = childElement;
    if (style.width !== widthPx) style.width = widthPx;
    if (style.height !== heightPx) style.height = heightPx;
    const transform = `matrix3d(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      ${interpolatedLayout.x}, ${interpolatedLayout.y}, 0, 1
    )`;
    style.transform = transform;
    //console.log("transform: ", style.transform, style, interpolatedLayout);

    // Update style
    // TODO
  }
}
