package com.ijzerenhein.sharedelement;

import java.util.Map;
import java.util.ArrayList;

import android.view.View;
import android.view.ViewGroup;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.ColorDrawable;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;
import com.facebook.react.views.image.ImageResizeMode;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.view.ReactViewGroup;

public class RNSharedElementNode extends Object {
    private int mReactTag;
    private View mView;
    private boolean mIsParent;
    private ReadableMap mStyleConfig;
    private View mResolvedView;
    private int mRefCount;
    private int mHideRefCount;
    private RNSharedElementStyle mInitialStyle;
    private ArrayList<Callback> mStyleCallbacks;

    public RNSharedElementNode(int reactTag, View view, boolean isParent, ReadableMap styleConfig) {
        mReactTag = reactTag;
        mView = view;
        mIsParent = isParent;
        mStyleConfig = styleConfig;
        mRefCount = 1;
        mHideRefCount = 0;
        mInitialStyle = null;
        mStyleCallbacks = null;
        mResolvedView = null;
        updateView();
    }

    public int getReactTag() {
        return mReactTag;
    }

    public int getRefCount() {
        return mRefCount;
    }

    public void setRefCount(int refCount) {
        mRefCount = refCount;
    }

    public void addHideRef() {
        mHideRefCount++;
        if (mHideRefCount == 1) {
            mView.setAlpha(0);
        }
    }

    public void releaseHideRef() {
        mHideRefCount--;
        if (mHideRefCount == 0) {
            if (mInitialStyle != null) setDrawStyle(mInitialStyle);
            mView.setAlpha(1);
        }
    }

    private View resolveView(View view) {
        if (view == null) return null;
        // TODO
        return view;
    }

    private void updateView() {
        View view = mView;
        if (mIsParent) {
            for(int index = 0; index < ((ViewGroup)mView).getChildCount(); ++index) {
                view = ((ViewGroup)mView).getChildAt(index);
                break;
            }
        }
        view = resolveView(view);
        if (mResolvedView == view) return;
        mResolvedView = view;
    }

    public void requestStyle(Callback callback) {
        if (mInitialStyle != null) {
            callback.invoke(mInitialStyle, this);
            return;
        }

        if (mStyleCallbacks == null) mStyleCallbacks = new ArrayList<Callback>();
        mStyleCallbacks.add(callback);
        fetchInitialStyle();
    }

    private void fetchInitialStyle() {
        View view = mResolvedView;
        if (view == null || mStyleCallbacks == null) return;

        // Get relative size and position
        int left = view.getLeft();
        int top = view.getTop();
        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 && height == 0) return;
        Rect frame = new Rect(left, top, left + width, top + height);

        // Get absolute layout
        int[] location = new int[2]; 
        view.getLocationOnScreen(location);
        // TODO, adjust width & height for scaling transforms
        Rect layout = new Rect(location[0], location[1], location[0] + width, location[1] + height);

        // Create style
        RNSharedElementStyle style = new RNSharedElementStyle();
        style.layout = layout;
        style.frame = frame;
        
        // Pre-fill the style with the style-config
        if (mStyleConfig.hasKey("opacity")) style.opacity = (float) mStyleConfig.getDouble("opacity");
        if (mStyleConfig.hasKey("backgroundColor")) style.backgroundColor = mStyleConfig.getInt("backgroundColor");
        if (mStyleConfig.hasKey("borderColor")) style.borderColor = mStyleConfig.getInt("borderColor");
        if (mStyleConfig.hasKey("borderWidth")) style.borderWidth = (float) mStyleConfig.getDouble("borderWidth");
        if (mStyleConfig.hasKey("resizeMode")) style.scaleType = ImageResizeMode.toScaleType(mStyleConfig.getString("resizeMode"));
        if (mStyleConfig.hasKey("elevation")) style.elevation = (float) mStyleConfig.getDouble("elevation");

        // Border-radius
        boolean isRTL = false;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
            isRTL = view.getLayoutDirection() == View.LAYOUT_DIRECTION_RTL;
        }
        if (mStyleConfig.hasKey("borderRadius")) {
            float borderRadius = (float) mStyleConfig.getDouble("borderRadius");
            style.borderTopLeftRadius = borderRadius;
            style.borderTopRightRadius = borderRadius;
            style.borderBottomLeftRadius = borderRadius;
            style.borderBottomRightRadius = borderRadius;
        }
        if (mStyleConfig.hasKey("borderTopEndRadius")) {
            float borderRadius = (float) mStyleConfig.getDouble("borderTopEndRadius");
            if (isRTL) {
                style.borderTopLeftRadius = borderRadius;
            } else {
                style.borderTopRightRadius = borderRadius;
            }
        }
        if (mStyleConfig.hasKey("borderTopStartRadius")) {
            float borderRadius = (float) mStyleConfig.getDouble("borderTopStartRadius");
            if (isRTL) {
                style.borderTopRightRadius = borderRadius;
            } else {
                style.borderTopLeftRadius = borderRadius;
            }
        }
        if (mStyleConfig.hasKey("borderBottomEndRadius")) {
            float borderRadius = (float) mStyleConfig.getDouble("borderBottomEndRadius");
            if (isRTL) {
                style.borderBottomLeftRadius = borderRadius;
            } else {
                style.borderBottomRightRadius = borderRadius;
            }
        }
        if (mStyleConfig.hasKey("borderBottomStartRadius")) {
            float borderRadius = (float) mStyleConfig.getDouble("borderBottomStartRadius");
            if (isRTL) {
                style.borderBottomRightRadius = borderRadius;
            } else {
                style.borderBottomLeftRadius = borderRadius;
            }
        }
        if (mStyleConfig.hasKey("borderTopLeftRadius")) style.borderTopLeftRadius = (float) mStyleConfig.getDouble("borderTopLeftRadius");
        if (mStyleConfig.hasKey("borderTopRightRadius")) style.borderTopRightRadius = (float) mStyleConfig.getDouble("borderTopRightRadius");
        if (mStyleConfig.hasKey("borderBottomLeftRadius")) style.borderBottomLeftRadius = (float) mStyleConfig.getDouble("borderBottomLeftRadius");
        if (mStyleConfig.hasKey("borderBottomRightRadius")) style.borderBottomRightRadius = (float) mStyleConfig.getDouble("borderBottomRightRadius");

        // Get opacity
        style.opacity = view.getAlpha();

        // Get elevation
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            style.elevation = view.getElevation();
        }

        // Update initial style cache
        mInitialStyle = style;

        // Notify callbacks
        ArrayList<Callback> callbacks = mStyleCallbacks;
        mStyleCallbacks = null;
        for (Callback callback : callbacks) { 
            callback.invoke(style, this);
        }
    }

    private void setDrawStyle(RNSharedElementStyle style) {

        // Get view to update
        View view = mResolvedView;

        // Set layout
        Rect frame = style.frame;
        view.layout(frame.left, frame.top, frame.width(), frame.height());

        // Set opacity
        //view.setAlpha(style.opacity);

        view.setBackgroundColor(style.backgroundColor);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            view.setElevation(style.elevation);
        }
        if (view instanceof ReactImageView) {
            ReactImageView imageView = (ReactImageView) view;
            imageView.setBorderColor(style.borderColor);
            imageView.setBorderWidth(style.borderWidth);
            imageView.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderTopLeftRadius), 0);
            imageView.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderTopRightRadius), 1);
            imageView.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderBottomRightRadius), 2);
            imageView.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderBottomLeftRadius), 3);
            imageView.setScaleType(style.scaleType);
            imageView.setTileMode(ImageResizeMode.defaultTileMode());
            imageView.maybeUpdateView();
        }
        else if (view instanceof ReactViewGroup) {
            ReactViewGroup viewGroup = (ReactViewGroup) view;
            viewGroup.setOpacityIfPossible(style.opacity);
            float borderColorRGB = (float) ((int)style.borderColor & 0x00FFFFFF);
            float borderColorAlpha = (float) ((int)style.borderColor >>> 24);
            viewGroup.setBorderColor(0, borderColorRGB, borderColorAlpha);
            viewGroup.setBorderWidth(0, PixelUtil.toPixelFromDIP(style.borderWidth));
            viewGroup.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderTopLeftRadius), 0);
            viewGroup.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderTopRightRadius), 1);
            viewGroup.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderBottomRightRadius), 2);
            viewGroup.setBorderRadius(PixelUtil.toPixelFromDIP(style.borderBottomLeftRadius), 3);
        }
    }

    public void draw(Canvas canvas, RNSharedElementStyle style) {
        setDrawStyle(style);
        mResolvedView.draw(canvas);
    }
}


/*

View startView = startStyle.getView();
            if (startView instanceof GenericDraweeView) {
                GenericDraweeView startImageView = (GenericDraweeView) startView;
                GenericDraweeHierarchy hierarchy = startImageView.getHierarchy();
                RectF imageBounds = new RectF();
                hierarchy.getActualImageBounds(imageBounds);
                Log.d(LOG_TAG, "onDraw, GenericDraweeView, imageBounds: " + imageBounds);
            }

            else if (startView instanceof ImageView) {
                ImageView startImageView = (ImageView) startView;
                Drawable drawable = startImageView.getDrawable();
                int intrinsicWidth = drawable.getIntrinsicWidth();
                int intrinsicHeight = drawable.getIntrinsicHeight();
                Log.d(LOG_TAG, "onDraw, imageDrawable: " + drawable + ", width: " + intrinsicWidth + ", height: " + intrinsicHeight);
            }
            */