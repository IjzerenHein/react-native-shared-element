import { Rect } from "./Rect";

/*int backgroundColor = Color.TRANSPARENT;
    float opacity = 1;
    float borderTopLeftRadius = 0;
    float borderTopRightRadius = 0;
    float borderBottomLeftRadius = 0;
    float borderBottomRightRadius = 0;
    float borderWidth = 0;
    int borderColor = Color.TRANSPARENT;
    String borderStyle = "solid";
    float elevation = 0;*/

type CSSStyleDeclaration = any;

export class RNSharedElementStyle {
  public readonly layout: Rect;
  public readonly style: CSSStyleDeclaration;

  constructor(layout: Rect, style: CSSStyleDeclaration) {
    this.layout = layout;
    this.style = style;
  }
}
