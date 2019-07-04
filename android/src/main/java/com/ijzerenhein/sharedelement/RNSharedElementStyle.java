package com.ijzerenhein.sharedelement;

import android.view.View;
import android.util.SizeF;
import android.graphics.RectF;
import android.graphics.Color;

import com.facebook.drawee.drawable.ScalingUtils;

public class RNSharedElementStyle extends Object {
    private View mView;
    private RectF mLayout;
    private SizeF mSize;
    private ScalingUtils.ScaleType mScaleType;
    private Color mBackgroundColor;
    private float mOpacity;
    private float mBorderRadius;
    private float mBorderWidth;
    private Color mBorderColor;
    private float mElevation;
    
    public RNSharedElementStyle(
        View view,
        RectF layout,
        SizeF size,
        ScalingUtils.ScaleType scaleType,
        float opacity,
        Color backgroundColor,
        float borderRadius,
        float borderWidth,
        Color borderColor,
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

    public ScalingUtils.ScaleType getScaleType() {
        return mScaleType;
    }

    public float getOpacity() {
        return mOpacity;
    }

    public Color getBackgroundColor() {
        return mBackgroundColor;
    }

    public float getBorderRadius() {
        return mBorderRadius;
    }

    public float getBorderWidth() {
        return mBorderWidth;
    }

    public Color getBorderColor() {
        return mBorderColor;
    }

    public float getElevation() {
        return mElevation;
    }
}