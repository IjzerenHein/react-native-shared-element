package com.ijzerenhein.sharedelement;

import java.util.ArrayList;

import android.util.Log;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.Callback;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.drawee.drawable.ScalingUtils;

public class RNSharedElementTransition extends ViewGroup {

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
    private View mStartView;
    private View mEndView;
    private RNSharedElementDrawable mStartDrawable;
    private RNSharedElementDrawable mEndDrawable;

    public RNSharedElementTransition(ThemedReactContext context, RNSharedElementNodeManager nodeManager) {
        super(context);
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "startAncestor", true));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "endAncestor", true));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "startNode", false));
        mItems.add(new RNSharedElementTransitionItem(nodeManager, "endNode", false));

        mStartView = new View(context);
        mStartDrawable = new RNSharedElementDrawable();
        mStartView.setBackground(mStartDrawable);
        addView(mStartView);

        mEndView = new View(context);
        mEndDrawable = new RNSharedElementDrawable();
        mEndView.setBackground(mEndDrawable);
        addView(mEndView);
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
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        if (!mReactLayoutSet) {
            mReactLayoutSet = true;

            // TODO - do this later after the whole layout pass
            // has completed
            requestStylesAndContent(true);
            mInitialLayoutPassCompleted = true;
            updateLayout();
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
        RNSharedElementTransitionItem startItem = mItems.get(ITEM_START);
        RNSharedElementTransitionItem startAncestor = mItems.get(ITEM_START_ANCESTOR);
        RNSharedElementTransitionItem endItem = mItems.get(ITEM_END);
        RNSharedElementTransitionItem endAncestor = mItems.get(ITEM_END_ANCESTOR);

        // Get styles & content
        RNSharedElementStyle startStyle = startItem.getStyle();
        RNSharedElementStyle endStyle = endItem.getStyle();
        if ((startStyle == null) && (endStyle == null)) return;
        RNSharedElementContent startContent = startItem.getContent();
        RNSharedElementContent endContent = endItem.getContent();

        // Get layout
        getLocationOnScreen(mParentLocation);
        Rect startLayout = (startStyle != null) ? normalizeLayout(startStyle.layout, startAncestor) : new Rect();
        Rect startVisibleLayout = (startStyle != null) ? normalizeLayout(startStyle.layout, startAncestor) : new Rect(); // TODO CLIP
        Rect endLayout = (endStyle != null) ? normalizeLayout(endStyle.layout, endAncestor) : new Rect();
        Rect endVisibleLayout = (endStyle != null) ? normalizeLayout(endStyle.layout, endAncestor) : new Rect(); // TODO CLIP

        // Get interpolated layout
        Rect interpolatedLayout;
        Rect interpolatedVisibleLayout;
        RNSharedElementStyle interpolatedStyle;
        if ((startStyle != null) && (endStyle != null)) {
            interpolatedLayout = getInterpolatedLayout(startLayout, endLayout, mNodePosition);
            interpolatedVisibleLayout = getInterpolatedLayout(startVisibleLayout, endVisibleLayout, mNodePosition);
            interpolatedStyle = getInterpolatedStyle(startStyle, startContent, endStyle, endContent, mNodePosition);
        } else if (startStyle != null) {
            interpolatedLayout = startLayout;
            interpolatedVisibleLayout = startVisibleLayout;
            interpolatedStyle = startStyle;
        } else {
            interpolatedLayout = endLayout;
            interpolatedVisibleLayout = endVisibleLayout;
            interpolatedStyle = endStyle;
        }

        // Update outer viewgroup layout. The outer viewgroup hosts 2 inner views
        // which draw the content & elevation. The outer viewgroup performs additional
        // clipping on these views.
        super.layout(
            interpolatedVisibleLayout.left,
            interpolatedVisibleLayout.top,
            interpolatedVisibleLayout.right,
            interpolatedVisibleLayout.bottom
        );

        // Render the start view
        mStartView.layout(
            interpolatedLayout.left - interpolatedVisibleLayout.left,
            interpolatedLayout.top - interpolatedVisibleLayout.top,
            (interpolatedLayout.left - interpolatedVisibleLayout.left) + interpolatedLayout.width(),
            (interpolatedLayout.top - interpolatedVisibleLayout.top) + interpolatedLayout.height()
        );
        mStartDrawable.setContent(startContent);
        mStartDrawable.setStyle(interpolatedStyle);
        mStartView.setElevation(interpolatedStyle.elevation);
        mStartView.setAlpha(interpolatedStyle.opacity);
        
        // Render the end view for "fade" animations
        if (!mAnimation.equals("move")) {
            mStartView.setAlpha(startStyle.opacity * (1 - mNodePosition));

            // Render the end view
            mEndView.layout(
                interpolatedLayout.left - interpolatedVisibleLayout.left,
                interpolatedLayout.top - interpolatedVisibleLayout.top,
                (interpolatedLayout.left - interpolatedVisibleLayout.left) + interpolatedLayout.width(),
                (interpolatedLayout.top - interpolatedVisibleLayout.top) + interpolatedLayout.height()
            );
            mEndDrawable.setContent(endContent);
            mEndDrawable.setStyle(interpolatedStyle);
            mEndView.setElevation(interpolatedStyle.elevation);
            mEndView.setAlpha(endStyle.opacity * mNodePosition);
            mEndView.invalidate();
        }

        // Invalidate
        mStartView.invalidate();
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

    private float calculateElevation(float position) {
        RNSharedElementTransitionItem startItem = mItems.get(ITEM_START);
        RNSharedElementTransitionItem endItem = mItems.get(ITEM_END);
        RNSharedElementStyle startStyle = startItem.getStyle();
        RNSharedElementStyle endStyle = endItem.getStyle();
        if ((startStyle == null) && (endStyle == null)) return 0;
        if ((startStyle != null) && (endStyle != null)) {
            return startStyle.elevation + ((endStyle.elevation - startStyle.elevation) * position);
        } else if (startStyle != null) {
            return startStyle.elevation;
        } else {
            return endStyle.elevation;
        }
    }

    /*@Override
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
        //Paint backgroundPaint = new Paint();
        //backgroundPaint.setColor(Color.argb(128, 255, 0, 0));
        //canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);

        // Draw start-item
        //canvas.save();
        //canvas.translate(
        //    interpolatedStyle.frame.left - interpolatedStyle.layout.left,
        //    interpolatedStyle.frame.top - interpolatedStyle.layout.top
        //);
        //Paint contentPaint = new Paint();
        //contentPaint.setColor(Color.argb(128, 0, 0, 255));
        //canvas.drawRect(0, 0, interpolatedStyle.frame.width(), interpolatedStyle.frame.height(), contentPaint);
        if (startContent != null) {
            startContent.draw(canvas, interpolatedStyle);
        }
        //canvas.restore();

        // Restore canvas
        canvas.restore();
}*/

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