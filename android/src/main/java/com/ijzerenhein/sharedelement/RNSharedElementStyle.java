package com.ijzerenhein.sharedelement;

import java.util.Locale;

import android.graphics.Rect;
import android.graphics.Color;
import android.graphics.Outline;
import android.support.v4.text.TextUtilsCompat;
import android.support.v4.view.ViewCompat;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;
import com.facebook.react.views.image.ImageResizeMode;

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
    public String borderStyle = "solid";
    public float elevation = 0;

    RNSharedElementStyle() {
        // nop
    }

    RNSharedElementStyle(ReadableMap config) {
        // Pre-fill the style with the style-config
        if (config.hasKey("opacity")) opacity = (float) config.getDouble("opacity");
        if (config.hasKey("backgroundColor")) backgroundColor = config.getInt("backgroundColor");
        if (config.hasKey("borderColor")) borderColor = config.getInt("borderColor");
        if (config.hasKey("borderWidth")) borderWidth = PixelUtil.toPixelFromDIP((float) config.getDouble("borderWidth"));
        if (config.hasKey("borderStyle")) borderStyle = config.getString("borderStyle");
        if (config.hasKey("resizeMode")) scaleType = ImageResizeMode.toScaleType(config.getString("resizeMode"));
        if (config.hasKey("elevation")) elevation = PixelUtil.toPixelFromDIP((float) config.getDouble("elevation"));

        // Border-radius
        boolean isRTL = TextUtilsCompat.getLayoutDirectionFromLocale(Locale.getDefault()) == ViewCompat.LAYOUT_DIRECTION_RTL;
        if (config.hasKey("borderRadius")) {
            float borderRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderRadius"));
            borderTopLeftRadius = borderRadius;
            borderTopRightRadius = borderRadius;
            borderBottomLeftRadius = borderRadius;
            borderBottomRightRadius = borderRadius;
        }
        if (config.hasKey("borderTopEndRadius")) {
            float borderRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderTopEndRadius"));
            if (isRTL) {
                borderTopLeftRadius = borderRadius;
            } else {
                borderTopRightRadius = borderRadius;
            }
        }
        if (config.hasKey("borderTopStartRadius")) {
            float borderRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderTopStartRadius"));
            if (isRTL) {
                borderTopRightRadius = borderRadius;
            } else {
                borderTopLeftRadius = borderRadius;
            }
        }
        if (config.hasKey("borderBottomEndRadius")) {
            float borderRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderBottomEndRadius"));
            if (isRTL) {
                borderBottomLeftRadius = borderRadius;
            } else {
                borderBottomRightRadius = borderRadius;
            }
        }
        if (config.hasKey("borderBottomStartRadius")) {
            float borderRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderBottomStartRadius"));
            if (isRTL) {
                borderBottomRightRadius = borderRadius;
            } else {
                borderBottomLeftRadius = borderRadius;
            }
        }
        if (config.hasKey("borderTopLeftRadius")) borderTopLeftRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderTopLeftRadius"));
        if (config.hasKey("borderTopRightRadius")) borderTopRightRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderTopRightRadius"));
        if (config.hasKey("borderBottomLeftRadius")) borderBottomLeftRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderBottomLeftRadius"));
        if (config.hasKey("borderBottomRightRadius")) borderBottomRightRadius = PixelUtil.toPixelFromDIP((float) config.getDouble("borderBottomRightRadius"));
    }
}
