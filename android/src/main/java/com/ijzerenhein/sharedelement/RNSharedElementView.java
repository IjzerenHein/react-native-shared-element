package com.ijzerenhein.sharedelement;

import android.util.Log;
import android.view.View;
import android.graphics.Rect;

import com.facebook.react.uimanager.ThemedReactContext;

class RNSharedElementView extends View {
    static private String LOG_TAG = "RNSharedElementView";
    
    private RNSharedElementDrawable mDrawable;
    private RNSharedElementDrawable.ViewType mViewType;

    RNSharedElementView(ThemedReactContext context) {
        super(context);
        mViewType = RNSharedElementDrawable.ViewType.NONE;
        mDrawable = new RNSharedElementDrawable();
        setBackground(mDrawable);
    }
    
    @Override
    public boolean hasOverlappingRendering () {
        return mViewType == RNSharedElementDrawable.ViewType.GENERIC;
    }

    void updateViewAndDrawable(
        Rect layout,
        Rect parentLayout,
        RNSharedElementContent content,
        Rect originalLayout,
        RNSharedElementStyle style,
        float alpha,
        float position) {

        // Update drawable
        RNSharedElementDrawable.ViewType viewType = mDrawable.update(content, style, position); 
        boolean useGPUScaling = (viewType == RNSharedElementDrawable.ViewType.GENERIC) || (viewType == RNSharedElementDrawable.ViewType.PLAIN);

        // Update layer type
        if (mViewType != viewType) {
            mViewType = viewType;
            setLayerType(useGPUScaling ? View.LAYER_TYPE_HARDWARE : View.LAYER_TYPE_NONE, null);
        }

        // Update view size/position/scale
        if (useGPUScaling) {

            // Update view
            layout(
                0,
                0,
                originalLayout.width(),
                originalLayout.height()
            );
            setTranslationX(layout.left - parentLayout.left);
            setTranslationY(layout.top - parentLayout.top);
            
            // Update scale
            float scaleX = (float)layout.width() / (float)originalLayout.width();
            float scaleY = (float)layout.height() / (float)originalLayout.height();
            /*if ((scaleX >= 1) && (scaleY >= 1)) {
                scaleX = Math.min(scaleX, scaleY);
                scaleY = scaleX;
            } else if ((scaleX <= 1) && (scaleY <= 1)) {
                scaleX = Math.max(scaleX, scaleY);
                scaleY = scaleX;
            }*/
            setScaleX(scaleX);
            setScaleY(scaleY);
            setPivotX(0);
            setPivotY(0);
        }
        else {

            // Update view
            layout(
                0,
                0,
                layout.width(),
                layout.height()
            );
            setTranslationX(layout.left - parentLayout.left);
            setTranslationY(layout.top - parentLayout.top);
        }

        // Update view opacity and elevation
        setAlpha(alpha);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            setElevation(style.elevation);
        }
    }
}
