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
    public boolean hasOverlappingRendering() {
        return mViewType == RNSharedElementDrawable.ViewType.GENERIC;
    }

    void updateViewAndDrawable(
            Rect layout,
            Rect parentLayout,
            RNSharedElementContent content,
            Rect originalLayout,
            RNSharedElementStyle style,
            float alpha,
            RNSharedElementResize resize,
            RNSharedElementAlign align,
            float position) {

        // Update drawable
        RNSharedElementDrawable.ViewType viewType = mDrawable.update(content, style, position);
        boolean useGPUScaling = (resize != RNSharedElementResize.CLIP) &&
                ((viewType == RNSharedElementDrawable.ViewType.GENERIC) ||
                        (viewType == RNSharedElementDrawable.ViewType.PLAIN));

        // Update layer type
        if (mViewType != viewType) {
            mViewType = viewType;
            setLayerType(useGPUScaling ? View.LAYER_TYPE_HARDWARE : View.LAYER_TYPE_NONE, null);
        }

        // Update view size/position/scale
        int width = layout.width();
        int height = layout.height();
        if (useGPUScaling) {
            int originalWidth = originalLayout.width();
            int originalHeight = originalLayout.height();

            // Update view
            layout(0, 0, originalWidth, originalHeight);
            setTranslationX(layout.left - parentLayout.left);
            setTranslationY(layout.top - parentLayout.top);

            // Update scale
            float scaleX = (float) width / (float) originalWidth;
            float scaleY = (float) height / (float) originalHeight;
            if (!Float.isInfinite(scaleX) && !Float.isNaN(scaleX) && !Float.isInfinite(scaleY) && !Float.isNaN(scaleY)) {

                // Determine si
                switch (resize) {
                    case AUTO:
                    case STRETCH:
                        break;
                    case CLIP:
                    case NONE:
                        scaleX = 1.0f;
                        scaleY = 1.0f;
                        break;
                }


                /*switch (align) {
                    case LEFT_TOP:
                        break;
                    case LEFT_CENTER:
                        break;
                    case LEFT_BOTTOM:
                        break;
                    case RIGHT_TOP:
                        break;
                    case RIGHT_CENTER:
                        break;
                    case RIGHT_BOTTOM:
                        break;
                    case CENTER_TOP:
                        break;
                    case CENTER_CENTER:
                        break;
                    case CENTER_BOTTOM:
                        break;
                }*/

                setScaleX(scaleX);
                setScaleY(scaleY);
            }
            setPivotX(0);
            setPivotY(0);
        } else {

            // Update view
            layout(0, 0, width, height);
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
