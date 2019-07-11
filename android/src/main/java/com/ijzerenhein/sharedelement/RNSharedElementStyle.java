package com.ijzerenhein.sharedelement;

import android.graphics.Rect;
import android.graphics.Color;

import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

public class RNSharedElementStyle extends Object {
    public Rect layout = new Rect(); // absolute layout on screen
    public Rect frame = new Rect(); // frame rect relative to parent
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
    
    /*public RNSharedElementStyle(
    ) {
        // nop
    }*/

    /*
    if ("contain".equals(resizeModeValue)) {
      return ScalingUtils.ScaleType.FIT_CENTER;
    }
    if ("cover".equals(resizeModeValue)) {
      return ScalingUtils.ScaleType.CENTER_CROP;
    }
    if ("stretch".equals(resizeModeValue)) {
      return ScalingUtils.ScaleType.FIT_XY;
    }
    if ("center".equals(resizeModeValue)) {
      return ScalingUtils.ScaleType.CENTER_INSIDE;
    }
    if ("repeat".equals(resizeModeValue)) {
      // Handled via a combination of ScaleType and TileMode
      return ScaleTypeStartInside.INSTANCE;
    }*/
}