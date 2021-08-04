import { Color, parseColor, interpolateColor } from "./Color.web";
import { Rect } from "./Rect.web";
import { CSSStyleDeclaration } from "./types";

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

function interpolate(val1: number, val2: number, position: number) {
  return val1 + (val2 - val1) * position;
}

export class RNSharedElementStyle {
  public readonly layout: Rect;
  public readonly style: CSSStyleDeclaration;
  public readonly opacity: number;
  public readonly backgroundColor: Color;

  constructor(layout: Rect, style: CSSStyleDeclaration) {
    this.layout = layout;
    this.style = style;
    this.opacity = Number(style.opacity);
    this.backgroundColor = parseColor(style.backgroundColor);
  }

  public static getInterpolatedLayout(
    layout1: Rect,
    layout2: Rect,
    position: number
  ) {
    return new Rect({
      x: interpolate(layout1.x, layout2.x, position),
      y: interpolate(layout1.y, layout2.y, position),
      width: interpolate(layout1.width, layout2.width, position),
      height: interpolate(layout1.height, layout2.height, position),
    });
  }

  public static getInterpolatedStyle(
    style1: RNSharedElementStyle,
    style2: RNSharedElementStyle,
    position: number
  ) {
    const layout = RNSharedElementStyle.getInterpolatedLayout(
      style1.layout,
      style2.layout,
      position
    );
    return new RNSharedElementStyle(layout, {
      ...style1,
      opacity: interpolate(style1.opacity, style2.opacity, position),
      backgroundColor: interpolateColor(
        style1.backgroundColor,
        style2.backgroundColor,
        position
      ),
    });
  }

  /* 

    private RNSharedElementStyle getInterpolatedStyle(
        RNSharedElementStyle style1,
        RNSharedElementContent content1,
        RNSharedElementStyle style2,
        RNSharedElementContent content2,
        float position
    ) {
        RNSharedElementStyle result = new RNSharedElementStyle();
        result.scaleType = RNSharedElementStyle.getInterpolatingScaleType(style1, style2, position);
        result.opacity = style1.opacity + ((style2.opacity - style1.opacity) * position);
        result.backgroundColor = getInterpolatedColor(style1.backgroundColor, style2.backgroundColor, position);
        result.borderTopLeftRadius = style1.borderTopLeftRadius + ((style2.borderTopLeftRadius - style1.borderTopLeftRadius) * position);
        result.borderTopRightRadius = style1.borderTopRightRadius + ((style2.borderTopRightRadius - style1.borderTopRightRadius) * position);
        result.borderBottomLeftRadius = style1.borderBottomLeftRadius + ((style2.borderBottomLeftRadius - style1.borderBottomLeftRadius) * position);
        result.borderBottomRightRadius = style1.borderBottomRightRadius + ((style2.borderBottomRightRadius - style1.borderBottomRightRadius) * position);
        result.borderWidth = style1.borderWidth + ((style2.borderWidth - style1.borderWidth) * position);
        result.borderColor = getInterpolatedColor(style1.borderColor, style2.borderColor, position);
        result.borderStyle = style1.borderStyle;
        result.elevation = style1.elevation + ((style2.elevation - style1.elevation) * position);
        return result;
    }*/
}
