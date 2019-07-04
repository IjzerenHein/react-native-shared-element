package com.ijzerenhein.sharedelement;

/*
import android.util.Log;
import android.graphics.Paint;
import android.graphics.Color;
import android.view.View;
*/

import android.graphics.Canvas;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class RNSharedElementTransition extends ReactViewGroup {

    static String LOG_TAG = "RNSharedElementTransition";

    private String mAnimation = null;
    private float mNodePosition = 0.0f;

    public RNSharedElementView(ThemedReactContext themedReactContext,
            RNSharedElementDataManager cloneDataManager) {
        super(themedReactContext);
        // Log.d(LOG_TAG, "Clone construct");
        //mCloneDataManager = cloneDataManager;
    }

    public void releaseData() {
        /*if (mData != null) {
            mCloneDataManager.release(mData);
            mData = null;
        }*/
    }

    /*private String getDebugName() {
        String source = ((mOptions & RNSharedElementOption.TARGET) != 0) ? "target" : "source";
        String type = ((mOptions & RNSharedElementOption.SCENE) != 0) ? "scene" : "component";
        return source + " " + type + " " + mId;
    }*/

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

    public void setAnimation(final String animation) {
        if (mAnimation != animation) {
            mAnimation = animation;
            invalidate();
        }
    }

    public void setNodePosition(final float nodePosition) {
        if (mNodePosition != nodePosition) {
            mNodePosition = nodePosition;
            invalidate();
        }
    }
}