package com.ijzerenhein.sharedelement;

import android.view.View;
import android.util.SizeF;
import android.graphics.RectF;
import android.graphics.Color;

import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

public class RNSharedElementStyle extends Object {
    private View mView;
    private RectF mLayout;
    private SizeF mSize;
    private ScaleType mScaleType;
    private int mBackgroundColor;
    private float mOpacity;
    private float mBorderRadius;
    private float mBorderWidth;
    private int mBorderColor;
    private float mElevation;
    
    public RNSharedElementStyle(
        View view,
        RectF layout,
        SizeF size,
        ScaleType scaleType,
        float opacity,
        int backgroundColor,
        float borderRadius,
        float borderWidth,
        int borderColor,
        float elevation) {
        mView = view;
        mLayout = layout;
        mSize = size;
        mScaleType = scaleType;
        mOpacity = opacity;
        mBackgroundColor = backgroundColor;
        mBorderRadius = borderRadius;
        mBorderWidth = borderWidth;
        mBorderColor = borderColor;
        mElevation = elevation;
    }

    public View getView() {
        return mView;
    }

    public RectF getLayout() {
        return mLayout;
    }

    public SizeF getSize() {
        return mSize;
    }


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

    public ScaleType getScaleType() {
        return mScaleType;
    }

    public float getOpacity() {
        return mOpacity;
    }

    public int getBackgroundColor() {
        return mBackgroundColor;
    }

    public float getBorderRadius() {
        return mBorderRadius;
    }

    public float getBorderWidth() {
        return mBorderWidth;
    }

    public int getBorderColor() {
        return mBorderColor;
    }

    public float getElevation() {
        return mElevation;
    }
}