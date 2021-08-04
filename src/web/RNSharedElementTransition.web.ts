import { RNSharedElementContent } from "./RNSharedElementContent.web";
import { RNSharedElementNodeManager } from "./RNSharedElementNodeManager.web";
import { RNSharedElementStyle } from "./RNSharedElementStyle.web";
import { RNSharedElementTransitionItem } from "./RNSharedElementTransitionItem.web";
// import { RNSharedElementNode } from "./RNSharedElementNode";
import { RNSharedElementView } from "./RNSharedElementView.web";
import { Rect } from "./Rect.web";
import {
  RNSharedElementNodeConfig,
  RNSharedElementAnimation,
  RNSharedElementResize,
  RNSharedElementAlign,
  IHTMLElement,
} from "./types";

export class RNSharedElementTransition {
  private items = [
    new RNSharedElementTransitionItem(
      RNSharedElementNodeManager.getInstance(),
      "start"
    ),
    new RNSharedElementTransitionItem(
      RNSharedElementNodeManager.getInstance(),
      "end"
    ),
  ];
  public animation: RNSharedElementAnimation = RNSharedElementAnimation.Move;
  public resize: RNSharedElementResize = RNSharedElementResize.Auto;
  public align: RNSharedElementAlign = RNSharedElementAlign.Auto;
  public nodePosition: number = 0;
  public element: IHTMLElement | null = null;
  private layout: Rect = Rect.empty;
  private views: (RNSharedElementView | null)[] = [null, null];

  public destroy() {
    this.element = null;
    this.items.forEach((item) => (item.node = null));
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
    this.items.forEach((item) => {
      if (item.needsStyle) {
        item.needsStyle = false;
        item.node!.requestStyle().then((style) => {
          item.style = style;
          this.updateLayout();
        });
      }
      if (item.needsContent) {
        item.needsContent = false;
        item.node!.requestContent().then((content) => {
          item.content = content;
          this.updateLayout();
        });
      }
    });
  }

  private updateNodeVisibility() {
    const { items, animation } = this;
    items.forEach((item) => {
      let hidden = !!(item.style && item.content);
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
      nodePosition,
      animation /*, animation, resize, align*/,
    } = this;
    if (!element) return;

    // Get parent layout
    this.layout = new Rect(element.getBoundingClientRect());

    // Get styles & content
    const startStyle = items[0].style;
    const endStyle = items[1].style;
    if (!startStyle && !endStyle) return;
    const startContent = items[0].content;
    const endContent = items[1].content;

    // Get start layout
    const startLayout = startStyle ? startStyle.layout : Rect.empty;
    const startContentLayout = startStyle
      ? RNSharedElementContent.getLayout(
          startLayout,
          startContent,
          startStyle.style.backgroundSize
        )
      : startLayout;
    //CGRect startVisibleLayout = startStyle ? [self normalizeLayout:[startItem visibleLayoutForAncestor:startAncestor] ancestor:startAncestor] : CGRectZero;
    //UIEdgeInsets startClipInsets = [self getClipInsets:startLayout visibleLayout:startVisibleLayout];

    // Get end layout
    const endLayout = endStyle ? endStyle.layout : Rect.empty;
    const endContentLayout = endStyle
      ? RNSharedElementContent.getLayout(
          endLayout,
          endContent || startContent,
          endStyle.style.backgroundSize
        )
      : endLayout;

    // Get interpolated layout
    let interpolatedLayout: Rect = startLayout;
    let interpolatedStyle: RNSharedElementStyle = startStyle!;
    let interpolatedContentLayout: Rect = startContentLayout;
    // let interpolatedClipInsets: Rect = Rect.empty;
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
      interpolatedContentLayout = RNSharedElementStyle.getInterpolatedLayout(
        startContentLayout,
        endContentLayout,
        nodePosition
      );
    } else if (startStyle) {
      interpolatedLayout = startLayout;
      interpolatedStyle = startStyle;
      interpolatedContentLayout = startContentLayout;
      // interpolatedClipInsets = startClipInsets;
    } else {
      interpolatedLayout = endLayout;
      interpolatedStyle = endStyle!;
      interpolatedContentLayout = endContentLayout;
      // interpolatedClipInsets = endClipInsets;
    }

    if (
      animation === RNSharedElementAnimation.Move ||
      animation === RNSharedElementAnimation.Fade ||
      animation === RNSharedElementAnimation.FadeOut
    ) {
      const startOpacity =
        animation === RNSharedElementAnimation.Move
          ? interpolatedStyle.opacity
          : (startStyle ? startStyle.opacity : 1) * (1 - nodePosition);
      this.updateView(
        0,
        interpolatedLayout,
        interpolatedStyle,
        interpolatedContentLayout,
        startLayout,
        startContent,
        startOpacity
      );
    }
    if (
      animation === RNSharedElementAnimation.Fade ||
      animation === RNSharedElementAnimation.FadeIn
    ) {
      const endOpacity = (endStyle ? endStyle.opacity : 1) * nodePosition;
      this.updateView(
        1,
        interpolatedLayout,
        interpolatedStyle,
        interpolatedContentLayout,
        endLayout,
        endContent,
        endOpacity
      );
    }
  }

  private updateView(
    index: number,
    interpolatedLayout: Rect,
    interpolatedStyle: RNSharedElementStyle,
    interpolatedContentLayout: Rect,
    originalLayout: Rect,
    content: RNSharedElementContent | null,
    opacity: number
  ) {
    // Find / create view
    let view = this.views[index];
    if (!view) {
      view = new RNSharedElementView();
      this.element!.appendChild(view.element);
      this.views[index] = view;
    }

    // Set resize & align
    view.resize = this.resize;
    view.align = this.align;

    // Set layouts
    view.parentLayout = this.layout;
    view.originalLayout = originalLayout;
    view.layout = interpolatedLayout;
    view.contentLayout = interpolatedContentLayout;

    // Set style
    view.style = interpolatedStyle;

    // If the content-element does not yet exist, then clone it and add it to the view
    if (!view.contentElement) {
      if (!content || !content.element) return;
      // @ts-ignore
      view.contentElement = content.element.cloneNode(true);
    }
    view.contentElement!.style.opacity = String(opacity);

    // Update layout
    view.updateLayout();
  }
}
