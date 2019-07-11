package com.ijzerenhein.sharedelement;

import android.graphics.Rect;
import android.graphics.Color;

import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

public class RNSharedElementStyle extends Object {
    public Rect layout = new Rect(); // absolute layout on screen
    public Rect frame = new Rect(); // frame rect relative to parent
    public float contentWidth = 0;
    public float contentHeight = 0;
    public ScaleType scaleType = ScaleType.FIT_XY;
    public int backgroundColor = Color.TRANSPARENT;
    public float opacity = 1;
    public float borderTopLeftRadius = 0;
    public float borderTopRightRadius = 0;
    public float borderBottomLeftRadius = 0;
    public float borderBottomRightRadius = 0;
    public float borderWidth = 0;
    public int borderColor = Color.TRANSPARENT;
    public float elevation = 0;

    public Rect getContentLayout(Rect layout, boolean reverse) {
      float width = layout.width();
      float height = layout.height();
      float contentAspectRatio = (contentWidth / contentHeight);
      boolean lo = (width / height) < contentAspectRatio;
      boolean aspectRatioCriteria = reverse ? !lo : lo;
      if (scaleType == ScaleType.FIT_CENTER) {
        // contain
        if (aspectRatioCriteria) {
          height = width / contentAspectRatio;
        } else {
          width = height * contentAspectRatio;
        }
      } else if (scaleType == ScaleType.CENTER_CROP) {
        // cover
        if (aspectRatioCriteria) {
          width = height * contentAspectRatio;
        } else {
          height = width / contentAspectRatio;
        }
      } else if (scaleType == ScaleType.CENTER_INSIDE) {
        // center
        width = contentWidth;
        height = contentHeight;
      }
      return new Rect(
        (int) (layout.left + ((layout.width() - width) / 2)),
        (int) (layout.top + ((layout.height() - height) / 2)),
        (int) (layout.right - ((layout.width() - width) / 2)),
        (int) (layout.bottom - ((layout.height() - height) / 2))
      );
    }
}
