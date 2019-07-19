package com.ijzerenhein.sharedelement;

import android.util.Log;
import android.view.View;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.graphics.Canvas;
import android.graphics.Path;
import android.graphics.Outline;
import android.graphics.PixelFormat;
import android.graphics.ColorFilter;

import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.view.ColorUtil;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewBackgroundDrawable;

import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;
import com.facebook.drawee.generic.RoundingParams;

class RNSharedElementDrawable extends Drawable {
    enum ViewType {
        NONE,
        REACTIMAGEVIEW,
        PLAIN,
        GENERIC,
    }

    static private String LOG_TAG = "RNSharedElementDrawable";
    static private boolean USE_GENERIC_SCALING = true;

    private RNSharedElementContent mContent = null;
    private RNSharedElementStyle mStyle = null;
    private ViewType mViewType = ViewType.NONE;
    private float mPosition = 0;
    private int mAlpha = 255;
    private Path mPathForBorderRadiusOutline = null;

    RNSharedElementStyle getStyle() {
        return mStyle;
    }

    RNSharedElementContent getContent() {
        return mContent;
    }

    float getPosition() {
        return mPosition;
    }

    boolean update(RNSharedElementContent content, RNSharedElementStyle style, float position) {
        boolean invalidated = false;

        // Update content
        if (mContent != content) {
            mContent = content;
            invalidated = true;
        }

        // Update view-type
        ViewType viewType = (mContent != null) ? RNSharedElementDrawable.getViewType(mContent.view) : ViewType.NONE;
        if (mViewType != viewType){
            mViewType = viewType;
            invalidated = true;
        }

        // Update & check style changes
        if ((mStyle != null) && (style != null) && !invalidated) {
            switch (viewType) {
                case REACTIMAGEVIEW:
                    if ((mStyle.compare(style)
                        | RNSharedElementStyle.PROP_BORDER
                        | RNSharedElementStyle.PROP_BACKGROUND_COLOR
                        | RNSharedElementStyle.PROP_SCALETYPE) != 0) {
                        invalidated = true;
                    } else {
                        invalidated = false;
                    }
                    break;
                case PLAIN:
                   if ((mStyle.compare(style)
                        | RNSharedElementStyle.PROP_BORDER
                        | RNSharedElementStyle.PROP_BACKGROUND_COLOR) != 0) {
                        invalidated = true;
                    }
                    else {
                        invalidated = false;
                    }
                    break;
                case GENERIC:
                    // nop
                    break;
            }
        }
        mStyle = style;

        // Update position
        mPosition = position;

        // Invalidate if neccessary
        if (invalidated) {
            invalidateSelf();
        }

        return USE_GENERIC_SCALING && (viewType == ViewType.GENERIC);
    }

    @Override
    public int getOpacity() {
        // This method was deprecated in API level 29.
        // This method is no longer used in graphics optimizations
        return PixelFormat.TRANSLUCENT;
    }

    @Override
    public void setColorFilter(ColorFilter cf) {
        // do nothing
    }

    @Override
    public void setAlpha(int alpha) {
        if (alpha != mAlpha) {
            mAlpha = alpha;
        }
    }

    @Override
    public int getAlpha() {
        return mAlpha;
    }

    /* Android's elevation implementation requires this to be implemented to know where to draw the shadow. */
    @Override
    public void getOutline(Outline outline) {
        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.LOLLIPOP) {
            super.getOutline(outline);
            return;
        }
        if (mStyle == null) {
            outline.setRect(getBounds());
            return;
        }
        if ((mStyle.borderTopLeftRadius == 0) &&
            (mStyle.borderTopRightRadius == 0) &&
            (mStyle.borderBottomLeftRadius == 0) &&
            (mStyle.borderBottomRightRadius == 0)) {
            outline.setRect(getBounds());
            return;
        }

        if (mPathForBorderRadiusOutline == null) {
            mPathForBorderRadiusOutline = new Path();
        } else {
            mPathForBorderRadiusOutline.reset();
        }
        float extraRadiusForOutline = mStyle.borderWidth / 2f;
        mPathForBorderRadiusOutline.addRoundRect(
            new RectF(getBounds()),
            new float[] {
                mStyle.borderTopLeftRadius + extraRadiusForOutline,
                mStyle.borderTopLeftRadius + extraRadiusForOutline,
                mStyle.borderTopRightRadius + extraRadiusForOutline,
                mStyle.borderTopRightRadius + extraRadiusForOutline,
                mStyle.borderBottomRightRadius + extraRadiusForOutline,
                mStyle.borderBottomRightRadius + extraRadiusForOutline,
                mStyle.borderBottomLeftRadius + extraRadiusForOutline,
                mStyle.borderBottomLeftRadius + extraRadiusForOutline
            },
            Path.Direction.CW
        );
        outline.setConvexPath(mPathForBorderRadiusOutline);
    }

    static private ViewType getViewType(View view) {
        if (view == null) return ViewType.NONE;
        if (view instanceof ReactImageView) {
            return ViewType.REACTIMAGEVIEW;
        }
        else if (view instanceof ReactViewGroup) {
            ReactViewGroup viewGroup = (ReactViewGroup) view;
            if (viewGroup.getChildCount() == 0) {
                return ViewType.PLAIN;
            }
        }
        return ViewType.GENERIC;
    }

    @Override
    public void draw(Canvas canvas) {
        //Log.d(LOG_TAG, "draw, viewType: " + mViewType + ", position: " + mPosition);
        switch (mViewType) {
            case REACTIMAGEVIEW:
                drawReactImageView(canvas);
                break;
            case PLAIN:
                drawPlainView(canvas);
                break;
            case GENERIC:
                drawGenericView(canvas);
                break;
        }
    }

    private void drawReactImageView(Canvas canvas) {
        // TODO FIX IMAGE STRETCH ISSUE WHEN IMAGE DOESN'T FILL 
        // ENTIRE CANVAS

        ReactImageView imageView = (ReactImageView) mContent.view;
        RNSharedElementStyle style = mStyle;
        DraweeController controller = imageView.getController();
        GenericDraweeHierarchy hierarchy = imageView.getHierarchy();
        Drawable drawable = hierarchy.getTopLevelDrawable();

        // Backup current props
        Rect oldBounds = new Rect(drawable.getBounds());
        ScaleType oldScaleType = hierarchy.getActualImageScaleType();
        RoundingParams oldRoundingParams = hierarchy.getRoundingParams();
        Drawable oldBackgroundImage = null; //hierarchy.getBackgroundImage();
        int oldFadeDuration = hierarchy.getFadeDuration();

        // Configure drawable
        drawable.setBounds(getBounds());
        hierarchy.setActualImageScaleType(style.scaleType);
        RoundingParams roundingParams = new RoundingParams();
        roundingParams.setBorderColor(style.borderColor);
        roundingParams.setBorderWidth(style.borderWidth);
        roundingParams.setRoundingMethod(RoundingParams.RoundingMethod.BITMAP_ONLY);
        roundingParams.setCornersRadii(
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius
        );
        hierarchy.setRoundingParams(roundingParams);
        hierarchy.setBackgroundImage(null);
        hierarchy.setFadeDuration(0);

        // Draw!
        drawable.draw(canvas);

        // Restore props
        hierarchy.setFadeDuration(oldFadeDuration);
        hierarchy.setBackgroundImage(oldBackgroundImage);
        hierarchy.setRoundingParams(oldRoundingParams);
        hierarchy.setActualImageScaleType(oldScaleType);
        drawable.setBounds(oldBounds);
    }

    private void drawPlainView(Canvas canvas) {
        RNSharedElementStyle style = mStyle;

        // Create drawable
        ReactViewBackgroundDrawable drawable = new ReactViewBackgroundDrawable(mContent.view.getContext());
        drawable.setBounds(getBounds());

        // Set background color
        drawable.setColor(style.backgroundColor);

        // Set border
        float borderColorRGB = (float) ((int)style.borderColor & 0x00FFFFFF);
        float borderColorAlpha = (float) ((int)style.borderColor >>> 24);
        drawable.setBorderStyle(style.borderStyle);
        for (int i = 0; i < 4; i++) {
            drawable.setBorderColor(i, borderColorRGB, borderColorAlpha);
            drawable.setBorderWidth(i, style.borderWidth);
        }
        drawable.setRadius(style.borderTopLeftRadius, 0);
        drawable.setRadius(style.borderTopRightRadius, 1);
        drawable.setRadius(style.borderBottomRightRadius, 2);
        drawable.setRadius(style.borderBottomLeftRadius, 3);

        // Draw!
        drawable.draw(canvas);
    }

    private void drawGenericView(Canvas canvas) {
        View view = mContent.view;
        if (USE_GENERIC_SCALING) {
            view.draw(canvas);
            return;
        }

        // Save canvas
        canvas.save();

        // Adjust scale
        Rect bounds = getBounds();
        float scaleX = (float)bounds.width() / (float)view.getWidth();
        float scaleY = (float)bounds.height() / (float)view.getHeight();
        float scale = 1;
        if ((scaleX >= 1) && (scaleY >= 1)) {
            scaleX = Math.min(scaleX, scaleY);
            scaleY = scaleX;
        } else if ((scaleX <= 1) && (scaleY <= 1)) {
            scaleX = Math.max(scaleX, scaleY);
            scaleY = scaleX;
        }
        canvas.scale(scaleX, scaleY);

        // Draw!
        view.draw(canvas);

        // Restore canvas
        canvas.save();
    }
}
