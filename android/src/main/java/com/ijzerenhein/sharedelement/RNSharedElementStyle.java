package com.ijzerenhein.sharedelement;

import java.util.Locale;

import android.graphics.Rect;
import android.graphics.Color;
import android.graphics.Matrix;
import android.view.View;
import android.view.ViewParent;
import android.content.Context;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;
import com.facebook.drawee.drawable.ScalingUtils.InterpolatingScaleType;
import com.facebook.react.views.image.ImageResizeMode;
import com.facebook.react.modules.i18nmanager.I18nUtil;

public class RNSharedElementStyle {
    static int PROP_OPACITY = 1 << 0;
    static int PROP_ELEVATION = 1 << 1;
    static int PROP_BACKGROUND_COLOR = 1 << 2;
    static int PROP_BORDER_COLOR = 1 << 3;
    static int PROP_BORDER_WIDTH = 1 << 4;
    static int PROP_BORDER_STYLE = 1 << 5;
    static int PROP_BORDER_TOPLEFTRADIUS = 1 << 6;
    static int PROP_BORDER_TOPRIGHTRADIUS = 1 << 7;
    static int PROP_BORDER_BOTTOMLEFTRADIUS = 1 << 8;
    static int PROP_BORDER_BOTTOMRIGHT_RADIUS = 1 << 9;
    static int PROP_BORDER =
        PROP_BORDER_COLOR +
        PROP_BORDER_WIDTH +
        PROP_BORDER_STYLE +
        PROP_BORDER_TOPLEFTRADIUS +
        PROP_BORDER_TOPRIGHTRADIUS +
        PROP_BORDER_BOTTOMLEFTRADIUS +
        PROP_BORDER_BOTTOMRIGHT_RADIUS;
    static int PROP_SCALETYPE = 1 << 10;

    Rect layout = new Rect(); // absolute layout on screen
    Rect frame = new Rect(); // frame rect relative to parent
    Matrix transform = new Matrix();
    ScaleType scaleType = ScaleType.FIT_XY;
    int backgroundColor = Color.TRANSPARENT;
    float opacity = 1;
    float borderTopLeftRadius = 0;
    float borderTopRightRadius = 0;
    float borderBottomLeftRadius = 0;
    float borderBottomRightRadius = 0;
    float borderWidth = 0;
    int borderColor = Color.TRANSPARENT;
    String borderStyle = "solid";
    float elevation = 0;

    RNSharedElementStyle() {
        // nop
    }

    RNSharedElementStyle(ReadableMap config, Context context) {
        // Pre-fill the style with the style-config
        if (config.hasKey("opacity")) opacity = (float) config.getDouble("opacity");
        if (config.hasKey("backgroundColor")) backgroundColor = config.getInt("backgroundColor");
        if (config.hasKey("borderColor")) borderColor = config.getInt("borderColor");
        if (config.hasKey("borderWidth")) borderWidth = PixelUtil.toPixelFromDIP((float) config.getDouble("borderWidth"));
        if (config.hasKey("borderStyle")) borderStyle = config.getString("borderStyle");
        if (config.hasKey("resizeMode")) scaleType = ImageResizeMode.toScaleType(config.getString("resizeMode"));
        if (config.hasKey("elevation")) elevation = PixelUtil.toPixelFromDIP((float) config.getDouble("elevation"));

        // Border-radius
        boolean isRTL = I18nUtil.getInstance().isRTL(context);
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

    static boolean equalsScaleType(ScaleType scaleType1, ScaleType scaleType2) {
        if (scaleType1 == scaleType2) return true;
        return false;
    }

    static ScaleType getInterpolatingScaleType(RNSharedElementStyle style1, RNSharedElementStyle style2, float position) {
        if (style1.scaleType == style2.scaleType) return style1.scaleType;
        InterpolatingScaleType scaleType = new InterpolatingScaleType(
            style1.scaleType,
            style2.scaleType,
            new Rect(0, 0, style1.layout.width(), style1.layout.height()),
            new Rect(0, 0, style2.layout.width(), style2.layout.height())
        );
        scaleType.setValue(position);
        return scaleType;
    }

    static Matrix getAbsoluteViewTransform(View view) {
        Matrix matrix = new Matrix(view.getMatrix());
        float[] vals = new float[9];
        matrix.getValues(vals);

        float[] vals2 = new float[9];
        ViewParent parentView = view.getParent();
        while (parentView != null && parentView instanceof View) {
            Matrix parentMatrix = ((View)parentView).getMatrix();
            parentMatrix.getValues(vals2);

            //vals[Matrix.MPERSP_0] *= vals2[Matrix.MPERSP_0];
            //vals[Matrix.MPERSP_1] *= vals2[Matrix.MPERSP_1];
            //vals[Matrix.MPERSP_2] *= vals2[Matrix.MPERSP_3];
            vals[Matrix.MSCALE_X] *= vals2[Matrix.MSCALE_X];
            vals[Matrix.MSCALE_Y] *= vals2[Matrix.MSCALE_Y];
            vals[Matrix.MSKEW_X] += vals2[Matrix.MSKEW_X];
            vals[Matrix.MSKEW_Y] += vals2[Matrix.MSKEW_Y];
            vals[Matrix.MTRANS_X] += vals2[Matrix.MTRANS_X];
            vals[Matrix.MTRANS_Y] += vals2[Matrix.MTRANS_Y];

            parentView = parentView.getParent();
        }
        if (parentView == null) return null;
        matrix.setValues(vals);
        return matrix;
    }

    int compare(RNSharedElementStyle style) {
        int res = 0;
        if (opacity != style.opacity) res += PROP_OPACITY;
        if (backgroundColor != style.backgroundColor) res += PROP_BACKGROUND_COLOR;
        if (borderColor != style.borderColor) res += PROP_BORDER_COLOR;
        if (borderWidth != style.borderWidth) res += PROP_BORDER_WIDTH;
        if (!borderStyle.equals(style.borderStyle)) res += PROP_BORDER_STYLE;
        if (borderTopLeftRadius != style.borderTopLeftRadius) res += PROP_BORDER_TOPLEFTRADIUS;
        if (borderTopRightRadius != style.borderTopRightRadius) res += PROP_BORDER_TOPRIGHTRADIUS;
        if (borderBottomLeftRadius != style.borderBottomLeftRadius) res += PROP_BORDER_BOTTOMLEFTRADIUS;
        if (borderBottomRightRadius != style.borderBottomRightRadius) res += PROP_BORDER_BOTTOMRIGHT_RADIUS;
        if (elevation != style.elevation) res += PROP_ELEVATION;
        if (!RNSharedElementStyle.equalsScaleType(scaleType, style.scaleType)) res += PROP_SCALETYPE;
        return res;
    }

    boolean isVisible() {
        if (opacity <= 0) return false;
        if (elevation > 0) return true;
        return (Color.alpha(backgroundColor) > 0) || (Color.alpha(borderColor) > 0);
    }
}
