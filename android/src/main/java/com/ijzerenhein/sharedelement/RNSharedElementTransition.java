package com.ijzerenhein.sharedelement;

import java.util.ArrayList;

import android.annotation.SuppressLint;
import android.os.Build;
import android.util.Log;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class RNSharedElementTransition extends ViewGroup {
    static private String LOG_TAG = "RNSharedElementTransition";
    static private Rect EMPTY_RECT = new Rect();

    enum Item {
        START(0),
        END(1);

        private final int value;
        Item(final int newValue) {value = newValue;}
        public int getValue() { return value; }
    }

    private RNSharedElementAnimation mAnimation = RNSharedElementAnimation.MOVE;
    private RNSharedElementResize mResize = RNSharedElementResize.STRETCH;
    private RNSharedElementAlign mAlign = RNSharedElementAlign.CENTER_CENTER;
    private float mNodePosition = 0.0f;
    private boolean mReactLayoutSet = false;
    private boolean mInitialLayoutPassCompleted = false;
    private ArrayList<RNSharedElementTransitionItem> mItems = new ArrayList<RNSharedElementTransitionItem>();
    private int[] mParentOffset = new int[2];
    private boolean mRequiresClipping = false;
    private RNSharedElementView mStartView;
    private RNSharedElementView mEndView;

    public RNSharedElementTransition(ThemedReactContext context, RNSharedElementNodeManager nodeManager) {
        super(context);
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "start"));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "end"));

        mStartView = new RNSharedElementView(context);
        addView(mStartView);

        mEndView = new RNSharedElementView(context);
        addView(mEndView);
    }

    public void releaseData() {
        for (RNSharedElementTransitionItem item : mItems) {
            item.setNode(null);
        }
    }

    public void setItemNode(Item item, RNSharedElementNode node) {
        mItems.get(item.getValue()).setNode(node);
        requestStylesAndContent(false);
    }

    public void setAnimation(final RNSharedElementAnimation animation) {
        if (mAnimation != animation) {
            mAnimation = animation;
            updateLayout();
        }
    }

    public void setResize(final RNSharedElementResize resize) {
        if (mResize != resize) {
            mResize = resize;
            updateLayout();
        }
    }

    public void setAlign(final RNSharedElementAlign align) {
        if (mAlign != align) {
            mAlign = align;
            updateLayout();
        }
    }

    public void setNodePosition(final float nodePosition) {
        if (mNodePosition != nodePosition) {
            mNodePosition = nodePosition;
            //Log.d(LOG_TAG, "setNodePosition " + nodePosition + ", mInitialLayoutPassCompleted: " + mInitialLayoutPassCompleted);
            updateLayout();
        }
    }

    @Override
    @SuppressLint("MissingSuperCall")
    public void requestLayout() {
        // No-op, terminate `requestLayout` here, all layout is updated in the 
        // `updateLayout` function
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        if (!mReactLayoutSet) {
            mReactLayoutSet = true;

            // Wait for the whole layout pass to have completed before
            // requesting the layout and content
            requestStylesAndContent(true);
            mInitialLayoutPassCompleted = true;
            updateLayout();
            updateNodeVisibility();      
        }
    }

    @Override
    public boolean hasOverlappingRendering() {
        return false;
    }

    @Override
    protected void dispatchDraw(Canvas canvas) {
        //Log.d(LOG_TAG, "dispatchDraw, mRequiresClipping: " + mRequiresClipping + ", width: " + getWidth() + ", height: " + getHeight());
        if (mRequiresClipping) {
            canvas.clipRect(0, 0, getWidth(), getHeight());
        }
        super.dispatchDraw(canvas);

        // Draw content
        //Paint backgroundPaint = new Paint();
        //backgroundPaint.setColor(Color.argb(128, 255, 0, 0));
        //canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);
    }

    private void requestStylesAndContent(boolean force) {
        if (!mInitialLayoutPassCompleted && !force) return;
        for (final RNSharedElementTransitionItem item : mItems) {
            if (item.getNeedsStyle()) {
                item.setNeedsStyle(false);
                item.getNode().requestStyle(new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        RNSharedElementStyle style = (RNSharedElementStyle) args[0];
                        item.setStyle(style);
                        updateLayout();
                        updateNodeVisibility();
                    }
                });
            }
            if (item.getNeedsContent()) {
                item.setNeedsContent(false);
                item.getNode().requestContent(new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        RNSharedElementContent content = (RNSharedElementContent) args[0];
                        item.setContent(content);
                        updateLayout();
                        updateNodeVisibility();
                    }
                });
            }
        }
    }

    private void updateLayout() {
        if (!mInitialLayoutPassCompleted) return;

        // Local data
        RNSharedElementTransitionItem startItem = mItems.get(Item.START.getValue());
        RNSharedElementTransitionItem endItem = mItems.get(Item.END.getValue());

        // Get styles & content
        RNSharedElementStyle startStyle = startItem.getStyle();
        RNSharedElementStyle endStyle = endItem.getStyle();
        if ((startStyle == null) && (endStyle == null)) return;
        RNSharedElementContent startContent = startItem.getContent();
        RNSharedElementContent endContent = endItem.getContent();

        // Get layout
        Rect startLayout = (startStyle != null) ? startStyle.layout : EMPTY_RECT;
        Rect startFrame = (startStyle != null) ? startStyle.frame : EMPTY_RECT;
        Rect endLayout = (endStyle != null) ? endStyle.layout : EMPTY_RECT;
        Rect endFrame = (endStyle != null) ? endStyle.frame : EMPTY_RECT;
        Rect parentLayout = new Rect(startLayout);
        parentLayout.union(endLayout);

        // Get clipped areas
        Rect startClippedLayout = (startStyle != null) ? startItem.getClippedLayout() : EMPTY_RECT;
        Rect startClipInsets = getClipInsets(startLayout, startClippedLayout);
        Rect endClippedLayout = (endStyle != null) ? endItem.getClippedLayout() : EMPTY_RECT;
        Rect endClipInsets = getClipInsets(endLayout, endClippedLayout);

        // Get interpolated layout
        Rect interpolatedLayout;
        Rect interpolatedClipInsets;
        RNSharedElementStyle interpolatedStyle;
        if ((startStyle != null) && (endStyle != null)) {
            interpolatedLayout = getInterpolatedLayout(startLayout, endLayout, mNodePosition);
            interpolatedClipInsets = getInterpolatedClipInsets(parentLayout, startClipInsets, startClippedLayout, endClipInsets, endClippedLayout, mNodePosition);
            interpolatedStyle = getInterpolatedStyle(startStyle, startContent, endStyle, endContent, mNodePosition);
        } else if (startStyle != null) {
            interpolatedLayout = startLayout;
            interpolatedStyle = startStyle;
            interpolatedClipInsets = startClipInsets;
        } else {
            interpolatedLayout = endLayout;
            interpolatedStyle = endStyle;
            interpolatedClipInsets = endClipInsets;
        }

        // Apply clipping insets
        parentLayout.left += interpolatedClipInsets.left;
        parentLayout.top += interpolatedClipInsets.top;
        parentLayout.right -= interpolatedClipInsets.right;
        parentLayout.bottom -= interpolatedClipInsets.bottom;

        // Calculate clipped layout
        mRequiresClipping = !parentLayout.contains(interpolatedLayout);

        //Log.d(LOG_TAG, "mRequiresClipping: " +mRequiresClipping + ", " + endClippedLayout + ", " + endClipInsets);

        // Update outer viewgroup layout. The outer viewgroup hosts 2 inner views
        // which draw the content & elevation. The outer viewgroup performs additional
        // clipping on these views.
        ((View)getParent()).getLocationOnScreen(mParentOffset);
        super.layout(
                -mParentOffset[0],
                -mParentOffset[1],
            parentLayout.width() - mParentOffset[0],
            parentLayout.height() - mParentOffset[1]
        );
        setTranslationX(parentLayout.left);
        setTranslationY(parentLayout.top);

        // Determine opacity
        float startAlpha = 1.0f;
        float endAlpha = 1.0f;
        switch (mAnimation) {
        case MOVE:
            startAlpha = interpolatedStyle.opacity;
            endAlpha = 0.0f;
            break;
        case FADE:
            startAlpha = ((startStyle != null) ? startStyle.opacity : 1) * (1 - mNodePosition);
            endAlpha = ((endStyle != null) ? endStyle.opacity : 1) * mNodePosition;
            break;
        case FADE_IN:
            startAlpha = 0.0f;
            endAlpha = ((endStyle != null) ? endStyle.opacity : 1) * mNodePosition;
            break;
        case FADE_OUT:
            startAlpha = ((startStyle != null) ? startStyle.opacity : 1) * (1 - mNodePosition);
            endAlpha = 0.0f;
            break;
        }

        // Render the start view
        if (mAnimation != RNSharedElementAnimation.FADE_IN) {
            mStartView.updateViewAndDrawable(
                interpolatedLayout,
                parentLayout,
                startLayout,
                startFrame,
                startContent,
                interpolatedStyle,
                startAlpha,
                mResize,
                mAlign,
                mNodePosition
            );
        }
        
        // Render the end view as well for the "cross-fade" animations
        if ((mAnimation == RNSharedElementAnimation.FADE) || (mAnimation == RNSharedElementAnimation.FADE_IN)) {
            mEndView.updateViewAndDrawable(
                interpolatedLayout,
                parentLayout,
                endLayout,
                endFrame,
                endContent,
                interpolatedStyle,
                endAlpha,
                mResize,
                mAlign,
                mNodePosition
            );

            // Also apply a fade effect on the elevation. This reduces the shadow visibility
            // underneath the view which becomes visible when the transparency of the view
            // is set. This in turn makes the shadow very visible and gives the whole view
            // a "grayish" appearance. The following code tries to reduce that visual artefact.
            if (interpolatedStyle.elevation > 0) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    mStartView.setOutlineAmbientShadowColor(Color.argb(startAlpha, 0, 0, 0));
                    mStartView.setOutlineSpotShadowColor(Color.argb(startAlpha, 0, 0, 0));
                    mEndView.setOutlineAmbientShadowColor(Color.argb(endAlpha, 0, 0, 0));
                    mEndView.setOutlineSpotShadowColor(Color.argb(endAlpha, 0, 0, 0));
                }
            }
        }

        // Fire events
        if ((startStyle != null) && !startItem.getHasCalledOnMeasure()) {
            startItem.setHasCalledOnMeasure(true);
            fireMeasureEvent("startNode", startItem, startClippedLayout);
        }
        if ((endStyle != null) && !endItem.getHasCalledOnMeasure()) {
            endItem.setHasCalledOnMeasure(true);
            fireMeasureEvent("endNode", endItem, endClippedLayout);
        }
    }

    private void updateNodeVisibility() {
        for (RNSharedElementTransitionItem item : mItems) {
            boolean hidden = mInitialLayoutPassCompleted &&
                (item.getStyle() != null) &&
                (item.getContent() != null);
            if (hidden && (mAnimation == RNSharedElementAnimation.FADE_IN) && item.getName().equals("start")) hidden = false;
            if (hidden && (mAnimation == RNSharedElementAnimation.FADE_OUT) && item.getName().equals("end")) hidden = false;
            item.setHidden(hidden);
        }
    }

    private Rect getClipInsets(Rect layout, Rect clippedLayout) {
        return new Rect(
            clippedLayout.left - layout.left,
            clippedLayout.top - layout.top,
            clippedLayout.right - layout.right,
            clippedLayout.bottom - layout.bottom
        );
    }

    private Rect getInterpolatedClipInsets(
        Rect interpolatedLayout,
        Rect startClipInsets,
        Rect startClippedLayout,
        Rect endClipInsets,
        Rect endClippedLayout,
        float position) {
        Rect clipInsets = new Rect();

        // Top
        if ((endClipInsets.top == 0) && (startClipInsets.top != 0) && (startClippedLayout.top <= endClippedLayout.top)) {
            clipInsets.top = Math.max(0, startClippedLayout.top - interpolatedLayout.top);
        } else if ((startClipInsets.top == 0) && (endClipInsets.top != 0) && (endClippedLayout.top <= startClippedLayout.top)) {
            clipInsets.top = Math.max(0, endClippedLayout.top - interpolatedLayout.top);
        } else {
            clipInsets.top = (int) (startClipInsets.top + ((endClipInsets.top - startClipInsets.top) * position));
        }

        // Bottom
        if ((endClipInsets.bottom == 0) && (startClipInsets.bottom != 0) && (startClippedLayout.bottom >= endClippedLayout.bottom)) {
            clipInsets.bottom = Math.max(0, interpolatedLayout.bottom - startClippedLayout.bottom);
        } else if ((startClipInsets.bottom == 0) && (endClipInsets.bottom != 0) && (endClippedLayout.bottom >= startClippedLayout.bottom)) {
            clipInsets.bottom = Math.max(0, interpolatedLayout.bottom - endClippedLayout.bottom);
        } else {
            clipInsets.bottom = (int) (startClipInsets.bottom + ((endClipInsets.bottom - startClipInsets.bottom) * position));
        }

        // Left
        if ((endClipInsets.left == 0) && (startClipInsets.left != 0) && (startClippedLayout.left <= endClippedLayout.left)) {
            clipInsets.left = Math.max(0, startClippedLayout.left - interpolatedLayout.left);
        } else if ((startClipInsets.left == 0) && (endClipInsets.left != 0) && (endClippedLayout.left <= startClippedLayout.left)) {
            clipInsets.left = Math.max(0, endClippedLayout.left - interpolatedLayout.left);
        } else {
            clipInsets.left = (int) (startClipInsets.left + ((endClipInsets.left - startClipInsets.left) * position));
        }

         // Right
        if ((endClipInsets.right == 0) && (startClipInsets.right != 0) && (startClippedLayout.right >= endClippedLayout.right)) {
            clipInsets.right = Math.max(0, interpolatedLayout.right - startClippedLayout.right);
        } else if ((startClipInsets.right == 0) && (endClipInsets.right != 0) && (endClippedLayout.right >= startClippedLayout.right)) {
            clipInsets.right = Math.max(0, interpolatedLayout.right - endClippedLayout.right);
        } else {
            clipInsets.right = (int) (startClipInsets.right + ((endClipInsets.right - startClipInsets.right) * position));
        }

        return clipInsets;
    }

    private Rect getInterpolatedLayout(Rect layout1, Rect layout2, float position) {
        return new Rect(
            (int) (layout1.left + ((layout2.left - layout1.left) * position)),
            (int) (layout1.top + ((layout2.top - layout1.top) * position)),
            (int) (layout1.right + ((layout2.right - layout1.right) * position)),
            (int) (layout1.bottom + ((layout2.bottom - layout1.bottom) * position))
        );
    }

    private int getInterpolatedColor(int color1, int color2, float position) {
        int redA = Color.red(color1);
        int greenA = Color.green(color1);
        int blueA = Color.blue(color1);
        int alphaA = Color.alpha(color1);
        int redB = Color.red(color2);
        int greenB = Color.green(color2);
        int blueB = Color.blue(color2);
        int alphaB = Color.alpha(color2);
        return Color.argb(
            (int) (alphaA + ((alphaB - alphaA) * position)),
            (int) (redA + ((redB - redA) * position)),
            (int) (greenA + ((greenB - greenA) * position)),
            (int) (blueA + ((blueB - blueA) * position))
        );
    }

    private RNSharedElementStyle getInterpolatedStyle(
        RNSharedElementStyle style1,
        RNSharedElementContent content1,
        RNSharedElementStyle style2,
        RNSharedElementContent content2,
        float position
    ) {
        RNSharedElementStyle result = new RNSharedElementStyle();
        result.scaleType = RNSharedElementStyle.getInterpolatingScaleType(style1, style2, position);
        result.opacity = style1.opacity + ((style2.opacity - style1.opacity) * position);
        result.backgroundColor = getInterpolatedColor(style1.backgroundColor, style2.backgroundColor, position);
        result.borderTopLeftRadius = style1.borderTopLeftRadius + ((style2.borderTopLeftRadius - style1.borderTopLeftRadius) * position);
        result.borderTopRightRadius = style1.borderTopRightRadius + ((style2.borderTopRightRadius - style1.borderTopRightRadius) * position);
        result.borderBottomLeftRadius = style1.borderBottomLeftRadius + ((style2.borderBottomLeftRadius - style1.borderBottomLeftRadius) * position);
        result.borderBottomRightRadius = style1.borderBottomRightRadius + ((style2.borderBottomRightRadius - style1.borderBottomRightRadius) * position);
        result.borderWidth = style1.borderWidth + ((style2.borderWidth - style1.borderWidth) * position);
        result.borderColor = getInterpolatedColor(style1.borderColor, style2.borderColor, position);
        result.borderStyle = style1.borderStyle;
        result.elevation = style1.elevation + ((style2.elevation - style1.elevation) * position);
        return result;
    }

    private void fireMeasureEvent(String name, RNSharedElementTransitionItem item, Rect clippedLayout) {
        ReactContext reactContext = (ReactContext)getContext();
        RNSharedElementStyle style = item.getStyle();
        RNSharedElementContent content = item.getContent();
        
        WritableMap layoutData = Arguments.createMap();
        layoutData.putDouble("x", PixelUtil.toDIPFromPixel(style.layout.left));
        layoutData.putDouble("y", PixelUtil.toDIPFromPixel(style.layout.top));
        layoutData.putDouble("width", PixelUtil.toDIPFromPixel(style.layout.width()));
        layoutData.putDouble("height", PixelUtil.toDIPFromPixel(style.layout.height()));
        layoutData.putDouble("visibleX", PixelUtil.toDIPFromPixel(clippedLayout.left));
        layoutData.putDouble("visibleY", PixelUtil.toDIPFromPixel(clippedLayout.top));
        layoutData.putDouble("visibleWidth", PixelUtil.toDIPFromPixel(clippedLayout.width()));
        layoutData.putDouble("visibleHeight", PixelUtil.toDIPFromPixel(clippedLayout.height()));
        layoutData.putDouble("contentX", PixelUtil.toDIPFromPixel(style.layout.left)); // TODO
        layoutData.putDouble("contentY", PixelUtil.toDIPFromPixel(style.layout.top)); // TODO
        layoutData.putDouble("contentWidth", PixelUtil.toDIPFromPixel(style.layout.width())); // TODO
        layoutData.putDouble("contentHeight", PixelUtil.toDIPFromPixel(style.layout.height())); // TODO

        WritableMap styleData = Arguments.createMap();
        styleData.putDouble("borderTopLeftRadius", PixelUtil.toDIPFromPixel(style.borderTopLeftRadius));
        styleData.putDouble("borderTopRightRadius", PixelUtil.toDIPFromPixel(style.borderTopRightRadius));
        styleData.putDouble("borderBottomLeftRadius", PixelUtil.toDIPFromPixel(style.borderBottomLeftRadius));
        styleData.putDouble("borderBottomRightRadius", PixelUtil.toDIPFromPixel(style.borderBottomRightRadius));

        WritableMap eventData = Arguments.createMap();
        eventData.putString("node", name);
        eventData.putMap("layout", layoutData);
        RNSharedElementDrawable.ViewType viewType = (content != null)
            ? RNSharedElementDrawable.getViewType(content.view, style)
            : RNSharedElementDrawable.ViewType.NONE;
        eventData.putString("contentType", viewType.getValue());
        eventData.putMap("style", styleData);

        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
            getId(),
            "onMeasureNode",
            eventData);
    }
}
