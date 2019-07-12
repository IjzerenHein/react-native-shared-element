package com.ijzerenhein.sharedelement;

import java.util.ArrayList;

import android.util.Log;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.Color;
import android.graphics.Paint;

import com.facebook.react.bridge.Callback;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.drawee.view.GenericDraweeView;
import com.facebook.drawee.drawable.ScalingUtils;

public class RNSharedElementTransition extends GenericDraweeView {

    static String LOG_TAG = "RNSharedElementTransition";

    static int ITEM_START_ANCESTOR = 0;
    static int ITEM_END_ANCESTOR = 1;
    static int ITEM_START = 2;
    static int ITEM_END = 3;

    private String mAnimation = "move";
    private float mNodePosition = 0.0f;
    private boolean mReactLayoutSet = false;
    private boolean mInitialLayoutPassCompleted = false;
    private ArrayList<RNSharedElementTransitionItem> mItems = new ArrayList<RNSharedElementTransitionItem>();
    private int[] mParentLocation = new int[2];

    public RNSharedElementTransition(ThemedReactContext themedReactContext, RNSharedElementNodeManager nodeManager) {
        super(themedReactContext);
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "startAncestor", true));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "endAncestor", true));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "startNode", false));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "endNode", false));
    }

    public void releaseData() {
        for (RNSharedElementTransitionItem item : mItems) {
            item.setNode(null);
        }
    }

    public void setStartNode(RNSharedElementNode node) {
        mItems.get(ITEM_START).setNode(node);
        requestStylesAndContent(false);
    }

    public void setEndNode(RNSharedElementNode node) {
        mItems.get(ITEM_END).setNode(node);
        requestStylesAndContent(false);
    }

    public void setStartAncestor(RNSharedElementNode node) {
        mItems.get(ITEM_START_ANCESTOR).setNode(node);
        requestStylesAndContent(false);
    }

    public void setEndAncestor(RNSharedElementNode node) {
        mItems.get(ITEM_END_ANCESTOR).setNode(node);
        requestStylesAndContent(false);
    }

    public void setAnimation(final String animation) {
        if (mAnimation != animation) {
            mAnimation = animation;
            updateLayoutAndInvalidate();
        }
    }

    public void setNodePosition(final float nodePosition) {
        if (mNodePosition != nodePosition) {
            mNodePosition = nodePosition;
            //Log.d(LOG_TAG, "setNodePosition " + nodePosition + ", mInitialLayoutPassCompleted: " + mInitialLayoutPassCompleted);
            updateLayoutAndInvalidate();
        }
    }

    @Override
    public void layout(int l, int t, int r, int b) {
        if (!mReactLayoutSet) {
            mReactLayoutSet = true;

            // TODO - do this later after the whole layout pass
            // has completed
            requestStylesAndContent(true);
            mInitialLayoutPassCompleted = true;
            updateLayoutAndInvalidate();
            updateNodeVisibility();
        }
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
                        updateLayoutAndInvalidate();
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
                        updateLayoutAndInvalidate();
                        updateNodeVisibility();
                    }
                });
            }
        }
    }

    private void updateLayoutAndInvalidate() {
        if (!mInitialLayoutPassCompleted) return;
        Rect layout = calculateLayout(mNodePosition);
        //Log.d(LOG_TAG, "updateLayoutAndInvalidate: " + layout);
        if (layout != null) super.layout(layout.left, layout.top, layout.right, layout.bottom);
        invalidate();
    }

    private void updateNodeVisibility() {
        for (RNSharedElementTransitionItem item : mItems) {
            boolean hidden = mInitialLayoutPassCompleted &&
                (item.getStyle() != null) &&
                (item.getContent() != null) &&
                !item.isAncestor();
            item.setHidden(hidden);
        }
    }

    private Rect normalizeLayout(Rect layout, RNSharedElementTransitionItem ancestor) {
        RNSharedElementStyle style = ancestor.getStyle();
        if (style == null) {
            return new Rect(
                layout.left - mParentLocation[0],
                layout.top - mParentLocation[1],
                layout.right - mParentLocation[0],
                layout.bottom - mParentLocation[1]
            );
        }

        Rect ancestorLayout = style.layout;
        return new Rect(
            layout.left - ancestorLayout.left,
            layout.top - ancestorLayout.top,
            layout.right - ancestorLayout.left,
            layout.bottom - ancestorLayout.top
        );
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
        // Interpolate using the HSV model
        // https://stackoverflow.com/a/38536770/3785358
        float[] hsva = new float[3];
        float[] hsvb = new float[3];
        float[] hsv_output = new float[3];
        Color.colorToHSV(color1, hsva);
        Color.colorToHSV(color2, hsvb);
        for (int i = 0; i < 3; i++) {
            hsv_output[i] = hsva[i] + ((hsvb[i] - hsva[i]) * position);
        }
        int alpha_a = Color.alpha(color1);
        int alpha_b = Color.alpha(color2);
        float alpha_output = alpha_a + ((alpha_b - alpha_a) * position);
        return Color.HSVToColor((int) alpha_output, hsv_output);
    }

    private RNSharedElementStyle getInterpolatedStyle(
        RNSharedElementStyle style1,
        RNSharedElementContent content1,
        RNSharedElementStyle style2,
        RNSharedElementContent content2,
        float position
    ) {
        RNSharedElementStyle result = new RNSharedElementStyle();
        ScalingUtils.InterpolatingScaleType scaleType = new ScalingUtils.InterpolatingScaleType(
            style1.scaleType,
            style2.scaleType,
            new Rect(0, 0, style1.layout.width(), style1.layout.height()),
            new Rect(0, 0, style2.layout.width(), style2.layout.height())
        );
        // TODO - Fix stretching issue
        scaleType.setValue(position);
        result.scaleType = scaleType;
        result.layout = getInterpolatedLayout(style1.frame, style2.frame, position);
        Rect contentLayout1 = RNSharedElementContent.getLayout(
            style1.frame,
            (content1 != null) ? content1.size : content2.size,
            style1.scaleType,
            false);
        Rect contentLayout2 = RNSharedElementContent.getLayout(
            style2.frame,
            (content2 != null) ? content2.size : content1.size,
            style2.scaleType,
            false);
        Rect interpolatedContentLayout = getInterpolatedLayout(contentLayout1, contentLayout2, position);
        result.frame = interpolatedContentLayout;
        result.opacity = style1.opacity + ((style2.opacity - style1.opacity) * position);
        result.backgroundColor = getInterpolatedColor(style1.backgroundColor, style2.backgroundColor, position);
        result.borderTopLeftRadius = style1.borderTopLeftRadius + ((style2.borderTopLeftRadius - style1.borderTopLeftRadius) * position);
        result.borderTopRightRadius = style1.borderTopRightRadius + ((style2.borderTopRightRadius - style1.borderTopRightRadius) * position);
        result.borderBottomLeftRadius = style1.borderBottomLeftRadius + ((style2.borderBottomLeftRadius - style1.borderBottomLeftRadius) * position);
        result.borderBottomRightRadius = style1.borderBottomRightRadius + ((style2.borderBottomRightRadius - style1.borderBottomRightRadius) * position);
        result.borderWidth = style1.borderWidth + ((style2.borderWidth - style1.borderWidth) * position);
        result.borderColor = getInterpolatedColor(style1.borderColor, style2.borderColor, position);
        result.elevation = style1.elevation + ((style2.elevation - style1.elevation) * position);
        return result;
    }

    private Rect calculateLayout(float position) {

        // Local data
        RNSharedElementTransitionItem startItem = mItems.get(ITEM_START);
        RNSharedElementTransitionItem startAncestor = mItems.get(ITEM_START_ANCESTOR);
        RNSharedElementTransitionItem endItem = mItems.get(ITEM_END);
        RNSharedElementTransitionItem endAncestor = mItems.get(ITEM_END_ANCESTOR);

        // Get styles
        RNSharedElementStyle startStyle = startItem.getStyle();
        RNSharedElementStyle endStyle = endItem.getStyle();
        if ((startStyle == null) && (endStyle == null)) return null;

        // Get layout
        getLocationOnScreen(mParentLocation);
        Rect startLayout = (startStyle != null) ? normalizeLayout(startStyle.layout, startAncestor) : new Rect();
        Rect endLayout = (endStyle != null) ? normalizeLayout(endStyle.layout, endAncestor) : new Rect();

        // Get interpolated layout
        if ((startStyle != null) && (endStyle != null)) {
            return getInterpolatedLayout(startLayout, endLayout, position);
        } else if (startStyle != null) {
            return startLayout;
        } else {
            return endLayout;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        //Log.d(LOG_TAG, "onDraw " + mNodePosition + ", interpolatedStyle: " + interpolatedStyle);
    
        // Local data
        RNSharedElementTransitionItem startItem = mItems.get(ITEM_START);
        RNSharedElementTransitionItem startAncestor = mItems.get(ITEM_START_ANCESTOR);
        RNSharedElementTransitionItem endItem = mItems.get(ITEM_END);
        RNSharedElementTransitionItem endAncestor = mItems.get(ITEM_END_ANCESTOR);

        // Get start layout
        RNSharedElementStyle startStyle = startItem.getStyle();
        RNSharedElementContent startContent = startItem.getContent();

        // Get end layout
        RNSharedElementStyle endStyle = endItem.getStyle();
        RNSharedElementContent endContent = endItem.getContent();

        // Get interpolated style & layout
        RNSharedElementStyle interpolatedStyle;
        if ((startStyle == null) && (endStyle == null)) return;
        if ((startContent == null) && (endContent == null)) return;
        if ((startStyle != null) && (endStyle != null)) {
            interpolatedStyle = getInterpolatedStyle(startStyle, startContent, endStyle, endContent, mNodePosition);
        } else if (startStyle != null) {
            interpolatedStyle = startStyle;
        } else {
            interpolatedStyle = endStyle;
        }

        // Start canvas drawing
        canvas.save();

        // Clip contents
        canvas.clipRect(0, 0, getWidth(), getHeight());

        // Draw content
        /*Paint backgroundPaint = new Paint();
        backgroundPaint.setColor(Color.argb(128, 255, 0, 0));
        canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);*/

        // Draw start-item
        /*canvas.save();
        canvas.translate(
            interpolatedStyle.frame.left - interpolatedStyle.layout.left,
            interpolatedStyle.frame.top - interpolatedStyle.layout.top
        );
        Paint contentPaint = new Paint();
        contentPaint.setColor(Color.argb(128, 0, 0, 255));
        canvas.drawRect(0, 0, interpolatedStyle.frame.width(), interpolatedStyle.frame.height(), contentPaint);*/
        if (startContent != null) {
            startContent.draw(canvas, interpolatedStyle);
        }
        //canvas.restore();

        // Restore canvas
        canvas.restore();

    }

    private void fireMeasureEvent() {
        /*ReactContext reactContext = (ReactContext)getContext();
        WritableMap eventData = Arguments.createMap();
        WritableMap layoutData = Arguments.createMap();
        layoutData.putFloat();
        //eventData.putString("message", "MyMessage");
        eventData.putString("node", item.name);
        eventData.putMap("layout", layoutData)
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
            getId(),
            "onMeasure",
            eventData);*/

        /*
        - (void) fireMeasureEvent:(RNSharedElementTransitionItem*) item layout:(CGRect)layout visibleLayout:(CGRect)visibleLayout contentLayout:(CGRect)contentLayout
{
    if (!self.onMeasureNode) return;
    NSDictionary* eventData = @{
                                @"node": item.name,
                                @"layout": @{
                                        @"x": @(layout.origin.x),
                                        @"y": @(layout.origin.y),
                                        @"width": @(layout.size.width),
                                        @"height": @(layout.size.height),
                                        @"visibleX": @(visibleLayout.origin.x),
                                        @"visibleY": @(visibleLayout.origin.y),
                                        @"visibleWidth": @(visibleLayout.size.width),
                                        @"visibleHeight": @(visibleLayout.size.height),
                                        @"contentX": @(contentLayout.origin.x),
                                        @"contentY": @(contentLayout.origin.y),
                                        @"contentWidth": @(contentLayout.size.width),
                                        @"contentHeight": @(contentLayout.size.height),
                                        },
                                @"contentType": item.contentTypeName,
                                @"style": @{
                                        @"borderRadius": @(item.style.cornerRadius)
                                        }
                                };
    self.onMeasureNode(eventData);
}*/
    }
}