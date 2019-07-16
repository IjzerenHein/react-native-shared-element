package com.ijzerenhein.sharedelement;

import java.util.ArrayList;
import javax.annotation.Nullable;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Animatable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.drawee.view.GenericDraweeView;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.backends.pipeline.PipelineDraweeController;

class RNSharedElementNode {
    static private String LOG_TAG = "RNSharedElementNode";

    private int mReactTag;
    private View mView;
    private boolean mIsParent;
    private ReadableMap mStyleConfig;
    private View mResolvedView;
    private int mRefCount;
    private int mHideRefCount;
    private float mHideAlpha;
    private RNSharedElementStyle mStyleCache;
    private ArrayList<Callback> mStyleCallbacks;
    private RNSharedElementContent mContentCache;
    private ArrayList<Callback> mContentCallbacks;
    private BaseControllerListener<ImageInfo> mDraweeControllerListener;

    RNSharedElementNode(int reactTag, View view, boolean isParent, ReadableMap styleConfig) {
        mReactTag = reactTag;
        mView = view;
        mIsParent = isParent;
        mStyleConfig = styleConfig;
        mRefCount = 1;
        mHideRefCount = 0;
        mHideAlpha = 1;
        mStyleCache = null;
        mStyleCallbacks = null;
        mContentCache = null;
        mContentCallbacks = null;
        mResolvedView = null;
        mDraweeControllerListener = null;
        updateView();
    }

    int getReactTag() {
        return mReactTag;
    }

    int getRefCount() {
        return mRefCount;
    }

    void setRefCount(int refCount) {
        mRefCount = refCount;
        if (mRefCount == 0) {
            removeDraweeControllerListener();
        }
    }

    void addHideRef() {
        mHideRefCount++;
        if (mHideRefCount == 1) {
            mHideAlpha = mView.getAlpha();
            mView.setAlpha(0);
        }
    }

    void releaseHideRef() {
        mHideRefCount--;
        if (mHideRefCount == 0) {
            mView.setAlpha(mHideAlpha);
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
        removeDraweeControllerListener();
        mResolvedView = view;
    }

    View getResolvedView() {
        return mResolvedView;
    }

    void requestStyle(Callback callback) {
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

    void requestContent(Callback callback) {
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
        if (contentSize == null) {
            // Image has not yet been fetches, listen for it
            addDraweeControllerListener();
            return;
        }

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

    private void addDraweeControllerListener() {
        if (mDraweeControllerListener != null) return;

        if (!(mResolvedView instanceof GenericDraweeView)) return;
        GenericDraweeView imageView = (GenericDraweeView) mResolvedView;
        DraweeController controller = imageView.getController();
        if (!(controller instanceof PipelineDraweeController)) return;
        PipelineDraweeController pipelineController = (PipelineDraweeController) controller;

        mDraweeControllerListener = new BaseControllerListener<ImageInfo>() {
            @Override
            public void onSubmit(String id, Object callerContext) {
                Log.d(LOG_TAG, "mDraweeControllerListener.onSubmit: " + id + ", callerContext: " + callerContext);
            }
    
            @Override
            public void onFinalImageSet(
              String id,
              @Nullable final ImageInfo imageInfo,
              @Nullable Animatable animatable) {
                Log.d(LOG_TAG, "mDraweeControllerListener.onFinalImageSet: " + id + ", imageInfo: " + imageInfo);
                removeDraweeControllerListener();
                fetchInitialContent();
            }
    
            @Override
            public void onFailure(String id, Throwable throwable) {
                Log.d(LOG_TAG, "mDraweeControllerListener.onFailure: " + id + ", throwable: " + throwable);
            }
        };

        pipelineController.addControllerListener(mDraweeControllerListener);
    }

    private void removeDraweeControllerListener() {
        if (mDraweeControllerListener == null) return;
        GenericDraweeView imageView = (GenericDraweeView) mResolvedView;
        DraweeController controller = imageView.getController();
        if (!(controller instanceof PipelineDraweeController)) return;
        PipelineDraweeController pipelineController = (PipelineDraweeController) controller;
        pipelineController.removeControllerListener(mDraweeControllerListener);
        mDraweeControllerListener = null;
    }
}
