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

  public static getInterpolatedLayout(
    layout1: Rect,
    layout2: Rect,
    position: number
  ) {
    return new Rect({
      x: layout1.x + (layout2.x - layout1.x) * position,
      y: layout1.y + (layout2.y - layout1.y) * position,
      width: layout1.width + (layout2.width - layout1.width) * position,
      height: layout1.height + (layout2.height - layout1.height) * position
    });
  }

  public static getInterpolatedColor(
    color1: number,
    color2: number,
    position: number
  ) {
    /* TODO
    int redA = Color.red(color1);
        int greenA = Color.green(color1);
        int blueA = Color.blue(color1);
        int alphaA = Color.alpha(color1);
        int redB = Color.red(color2);
        int greenB = Color.green(color2);
        int blueB = Color.blue(color2);
        int alphaB = Color.alpha(color2);
        return Color.argb(
            (int) (alphaA + ((alphaB - alphaA) * position)),
            (int) (redA + ((redB - redA) * position)),
            (int) (greenA + ((greenB - greenA) * position)),
            (int) (blueA + ((blueB - blueA) * position))
        );*/
    return color1 + (color2 - color1) * position;
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
    return new RNSharedElementStyle(layout, style1);
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
