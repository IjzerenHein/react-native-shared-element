package com.ijzerenhein.sharedelement;

import java.util.ArrayList;

import android.view.View;
import android.view.ViewGroup;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.RectF;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
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
    private RNSharedElementStyle mStyleCache;
    private ArrayList<Callback> mStyleCallbacks;
    private RNSharedElementContent mContentCache;
    private ArrayList<Callback> mContentCallbacks;

    public RNSharedElementNode(int reactTag, View view, boolean isParent, ReadableMap styleConfig) {
        mReactTag = reactTag;
        mView = view;
        mIsParent = isParent;
        mStyleConfig = styleConfig;
        mRefCount = 1;
        mHideRefCount = 0;
        mStyleCache = null;
        mStyleCallbacks = null;
        mContentCache = null;
        mContentCallbacks = null;
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
            if (mStyleCache != null) setDrawStyle(mStyleCache);
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
        if (mStyleCache != null) {
            callback.invoke(mStyleCache, this);
            return;
        }
        if (mStyleCallbacks == null) mStyleCallbacks = new ArrayList<Callback>();
        mStyleCallbacks.add(callback);
        fetchInitialStyle();
    }

    private void fetchInitialStyle() {
        View view = mResolvedView;
        if (view == null || mStyleCallbacks == null) return;

        // Get relative size and position within parent
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
        RNSharedElementStyle style = new RNSharedElementStyle(mStyleConfig);
        style.layout = layout;
        style.frame = frame;
        
        // Get opacity
        style.opacity = view.getAlpha();

        // Get elevation
        /*if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            style.elevation = view.getElevation();
        }*/

        // Update initial style cache
        mStyleCache = style;

        // Notify callbacks
        ArrayList<Callback> callbacks = mStyleCallbacks;
        mStyleCallbacks = null;
        for (Callback callback : callbacks) { 
            callback.invoke(style, this);
        }
    }

    public void requestContent(Callback callback) {
        if (mContentCache != null) {
            callback.invoke(mContentCache, this);
            return;
        }
        if (mContentCallbacks == null) mContentCallbacks = new ArrayList<Callback>();
        mContentCallbacks.add(callback);
        fetchInitialContent();
    }

    private void fetchInitialContent() {
        View view = mResolvedView;
        if (view == null || mContentCallbacks == null) return;

        // Verify view size
        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 && height == 0) return;

        // Get content size (e.g. the size of the underlying image of an image-view)
        RectF contentSize = RNSharedElementContent.getSize(view);
        if (contentSize == null) return;

        // Create content
        RNSharedElementContent content = new RNSharedElementContent();
        content.view = view;
        content.size = contentSize;
        
        // Update cache
        mContentCache = content;

        // Notify callbacks
        ArrayList<Callback> callbacks = mContentCallbacks;
        mContentCallbacks = null;
        for (Callback callback : callbacks) { 
            callback.invoke(content, this);
        }
    }

    private void setDrawStyle(RNSharedElementStyle style) {

        // Get view to update
        View view = mResolvedView;

        // Set layout
        Rect frame = style.frame;
        //view.layout(frame.left, frame.top, frame.width(), frame.height());
        view.layout(0, 0, frame.width(), frame.height());

        // Set opacity
        //view.setAlpha(style.opacity);

        view.setBackgroundColor(style.backgroundColor);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            view.setElevation(style.elevation);
        }
        if (view instanceof ReactImageView) {
            ReactImageView imageView = (ReactImageView) view;
            imageView.setBorderColor(style.borderColor);
            imageView.setBorderWidth(PixelUtil.toDIPFromPixel(style.borderWidth));
            imageView.setBorderRadius(style.borderTopLeftRadius, 0);
            imageView.setBorderRadius(style.borderTopRightRadius, 1);
            imageView.setBorderRadius(style.borderBottomRightRadius, 2);
            imageView.setBorderRadius(style.borderBottomLeftRadius, 3);
            imageView.setScaleType(style.scaleType);
            //imageView.setScaleType(ScaleType.FIT_XY);
            imageView.setTileMode(ImageResizeMode.defaultTileMode());
            imageView.maybeUpdateView();
        }
        else if (view instanceof ReactViewGroup) {
            ReactViewGroup viewGroup = (ReactViewGroup) view;
            viewGroup.setOpacityIfPossible(style.opacity);
            float borderColorRGB = (float) ((int)style.borderColor & 0x00FFFFFF);
            float borderColorAlpha = (float) ((int)style.borderColor >>> 24);
            viewGroup.setBorderColor(0, borderColorRGB, borderColorAlpha);
            viewGroup.setBorderWidth(0, style.borderWidth);
            viewGroup.setBorderRadius(style.borderTopLeftRadius, 0);
            viewGroup.setBorderRadius(style.borderTopRightRadius, 1);
            viewGroup.setBorderRadius(style.borderBottomRightRadius, 2);
            viewGroup.setBorderRadius(style.borderBottomLeftRadius, 3);
        }
        // TODO z-index reset?
    }

    public void draw(Canvas canvas, RNSharedElementStyle style) {
        setDrawStyle(style);
        mResolvedView.draw(canvas);
    }
}
