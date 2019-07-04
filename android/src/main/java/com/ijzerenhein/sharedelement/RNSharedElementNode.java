package com.ijzerenhein.sharedelement;

import java.util.Map;

import android.view.View;
import android.graphics.RectF;

public class RNSharedElementNode extends Object {
    private String mSharedId;
    private View mView;
    private RectF mLayout;
    private int mOptions;
    private int mRefCount;

    public RNSharedElementData(String sharedId, View view, RectF layout, int options) {
        mSharedId = sharedId;
        mLayout = layout;
        mView = view;
        mOptions = options;
        mRefCount = 1;
    }

    public String getSharedId() {
        return mSharedId;
    }

    public View getView() {
        return mView;
    }

    public RectF getLayout() {
        return mLayout;
    }

    public int getOptions() {
        return mOptions;
    }

    public int getRefCount() {
        return mRefCount;
    }

    public void setRefCount(int refCount) {
        mRefCount = refCount;
    }

    public String getKey() {
        return keyForSharedId(mSharedId, mOptions);
    }

    public static String keyForSharedId(String sharedId, int options) {
        String type;
        if ((options & RNSharedElementOption.SCENE) != 0) {
            type = ((options & RNSharedElementOption.TARGET) != 0) ? "TargetScene" : "SourceScene";
        } else {
            type = ((options & RNSharedElementOption.TARGET) != 0) ? "TargetComponent" : "SourceComponent";
        }
        return type + ":" + sharedId;
    }
}