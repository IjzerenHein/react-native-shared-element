package com.ijzerenhein.sharedelement;

import java.util.Map;
import java.util.ArrayList;

import android.view.View;
import android.view.ViewGroup;
import android.graphics.Rect;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.ColorDrawable;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

public class RNSharedElementNode extends Object {
    private int mReactTag;
    private View mView;
    private View mResolvedView;
    private boolean mIsParent;
    private int mRefCount;
    private int mHideRefCount;
    private RNSharedElementStyle mStyleCache;
    private ArrayList<Callback> mStyleCallbacks;

    public RNSharedElementNode(int reactTag, View view, boolean isParent) {
        mReactTag = reactTag;
        mView = view;
        mIsParent = isParent;
        mRefCount = 1;
        mHideRefCount = 0;
        mStyleCache = null;
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
            //mView.setVisibility(View.INVISIBLE);
        }
    }

    public void releaseHideRef() {
        mHideRefCount--;
        if (mHideRefCount == 0) {
            mView.setAlpha(1);
            //mView.setVisibility(View.VISIBLE);
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
        if (mStyleCache != null) {
            callback.invoke(mStyleCache, this);
            return;
        }

        if (mStyleCallbacks == null) mStyleCallbacks = new ArrayList<Callback>();
        mStyleCallbacks.add(callback);
        updateStyle();
    }

    private void updateStyle() {
        View view = mResolvedView;
        if (view == null || mStyleCallbacks == null) return;

        // Get size and absolute position
        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 && height == 0) return;

        // Get absolute layout
        int[] location = new int[2]; 
        view.getLocationOnScreen(location);
        Rect layout = new Rect(location[0], location[1], location[0] + width, location[1] + height);

        // Get background color
        int backgroundColor = Color.TRANSPARENT;
        Drawable background = view.getBackground();
        if (background instanceof ColorDrawable) {
            backgroundColor = ((ColorDrawable) background).getColor();
        }

        // Get elevation
        float elevation = 0;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            elevation = view.getElevation();
        }

        // Create style
        RNSharedElementStyle style = new RNSharedElementStyle(
            view,
            layout,
            width,
            height,
            ScaleType.FIT_XY, // TODO
            view.getAlpha(),
            backgroundColor,
            0, // borderRadius TODO
            0, // borderWidth TODO
            0, // borderColor TODO
            elevation
        );
        mStyleCache = style;

        // Notify callbacks
        ArrayList<Callback> callbacks = mStyleCallbacks;
        mStyleCallbacks = null;
        for (Callback callback : callbacks) { 
            callback.invoke(style, this);
        }
    }
}