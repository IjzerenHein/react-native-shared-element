package com.ijzerenhein.sharedelement;

import java.util.Map;

import android.view.View;
import android.graphics.RectF;

public class RNSharedElementNode extends Object {
    private int mReactTag;
    private View mView;
    private boolean mIsParent;
    private int mRefCount;
    private int mHideRefCount;

    public RNSharedElementNode(int reactTag, View view, boolean isParent) {
        mReactTag = reactTag;
        mView = view;
        mIsParent = isParent;
        mRefCount = 1;
        mHideRefCount = 1;
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

    public int getHideRefCount() {
        return mHideRefCount;
    }

    public void setHideRefCount(int hideRefCount) {
        mHideRefCount = hideRefCount;
        if (mHideRefCount == 1) {
            // TODO HIDE
        } else if (mHideRefCount == 0) {
            // TODO SHOW
        }
    }

    // TODO
}