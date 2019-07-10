package com.ijzerenhein.sharedelement;

import android.view.View;
import android.graphics.Rect;
import android.graphics.Color;

import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

public class RNSharedElementStyle extends Object {
    private View mView;
    private Rect mLayout;
    private int mWidth;
    private int mHeight;
    private ScaleType mScaleType;
    private int mBackgroundColor;
    private float mOpacity;
    private float mBorderRadius;
    private float mBorderWidth;
    private int mBorderColor;
    private float mElevation;
    
    public RNSharedElementStyle(
        View view,
        Rect layout,
        int width,
        int height,
        ScaleType scaleType,
        float opacity,
        int backgroundColor,
        float borderRadius,
        float borderWidth,
        int borderColor,
        float elevation) {
        mView = view;
        mLayout = layout;
        mWidth = width;
        mHeight = height;
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

    public Rect getLayout() {
        return mLayout;
    }

    public int getWidth() {
        return mWidth;
    }

    public int getHeight() {
        return mHeight;
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