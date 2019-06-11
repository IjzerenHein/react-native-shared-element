
package com.ijzerenhein.visualclone;

/*
import android.util.Log;
import android.graphics.Paint;
import android.graphics.Color;
import android.view.View;
*/

import android.graphics.Canvas;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class RNSharedElementView extends ReactViewGroup {

    static String LOG_TAG = "RNSharedElement";

    private RNSharedElementDataManager mCloneDataManager;
    private RNSharedElementData mData = null;
    private String mId = null;
    private int mOptions = 0;
    private int mContentType = 0;
    private float mBlurRadius = 0.0f;

    public RNSharedElementView(ThemedReactContext themedReactContext,
            RNSharedElementDataManager cloneDataManager) {
        super(themedReactContext);
        // Log.d(LOG_TAG, "Clone construct");
        mCloneDataManager = cloneDataManager;
    }

    public void releaseData() {
        if (mData != null) {
            mCloneDataManager.release(mData);
            mData = null;
        }
    }

    private String getDebugName() {
        String source = ((mOptions & RNSharedElementOption.TARGET) != 0) ? "target" : "source";
        String type = ((mOptions & RNSharedElementOption.SCENE) != 0) ? "scene" : "component";
        return source + " " + type + " " + mId;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // Log.d(LOG_TAG, "onDraw " + getDebugName() + ", width: " + canvas.getWidth() +
        // ", height: " + canvas.getHeight());
        if ((mData == null) && (mId != null) && ((mOptions & RNSharedElementOption.INITIAL) == 0)) {
            // Log.d(LOG_TAG, "mCloneDataManager.acquire " + getDebugName() + ", options: "
            // + mOptions);
            mData = mCloneDataManager.acquire(RNSharedElementData.keyForSharedId(mId, mOptions));
            // if (mData != null) Log.d(LOG_TAG, "Success!!");
        }

        if (mData == null)
            return;
        if ((mOptions & RNSharedElementOption.VISIBLE) == 0)
            return;
        if (mContentType == RNSharedElementContentType.CHILDREN) {
            /*
             * Paint paint = new Paint(); int width = this.getWidth(); int height =
             * this.getHeight(); paint.setColor(Color.BLUE);
             * paint.setStyle(Paint.Style.FILL); //fill the background with blue color
             * canvas.drawRect(0, 0, width, height, paint);
             */
            return;
        }

        mData.getView().draw(canvas);
    }

    public void setInitialData(RNSharedElementData data, int options, int contentType) {
        // Log.d(LOG_TAG, "setInitialData " + getDebugName() + ", layout: " +
        // data.getLayout());
        mData = data;
        mOptions = options;
        mContentType = contentType;
        invalidate();
    }

    public void setId(final String id) {
        if (mId != id) {
            mId = id;
            invalidate();
        }
    }

    public void setOptions(final int options) {
        if (mOptions != options) {
            // boolean wasVisible = ((mOptions & RNSharedElementOption.VISIBLE) != 0);
            // boolean isVisible = ((options & RNSharedElementOption.VISIBLE) != 0);
            mOptions = options;
            /*
             * if (wasVisible && !isVisible) { // setVisibility(View.INVISIBLE);
             * Log.d(LOG_TAG, "HIDE " + getDebugName() + ", left: " + getLeft() + ", top: "
             * + getTop()); }
             */
            invalidate();
        }
    }

    public void setContentType(final int contentType) {
        if (mContentType != contentType) {
            mContentType = contentType;
            invalidate();
        }
    }

    public void setBlurRadius(final float blurRadius) {
        if (mBlurRadius != blurRadius) {
            mBlurRadius = blurRadius;
            invalidate();
        }
    }
}