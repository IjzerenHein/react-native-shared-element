package com.ijzerenhein.sharedelement;

import java.util.ArrayList;

import android.util.Log;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.Paint;
import android.graphics.Color;
import android.view.View;

import com.facebook.react.bridge.Callback;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.drawee.view.GenericDraweeView;

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
        requestStyles(false);
    }

    public void setEndNode(RNSharedElementNode node) {
        mItems.get(ITEM_END).setNode(node);
        requestStyles(false);
    }

    public void setStartAncestor(RNSharedElementNode node) {
        mItems.get(ITEM_START_ANCESTOR).setNode(node);
        requestStyles(false);
    }

    public void setEndAncestor(RNSharedElementNode node) {
        mItems.get(ITEM_END_ANCESTOR).setNode(node);
        requestStyles(false);
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
        //int width = ((View)getParent()).getWidth();
        //int height = ((View)getParent()).getHeight();
        /*int width = r;
        int height = 1000;
        Log.d(LOG_TAG, "layout: " + l + ":" + t + ":" + r + ":" + b + ", width: " + width + ", height: " + height);
        super.layout(0, 0, width, height);*/

        if (!mReactLayoutSet) {
            mReactLayoutSet = true;

            // TODO - do this later after the whole layout pass
            // has completed
            requestStyles(true);
            mInitialLayoutPassCompleted = true;
            updateLayoutAndInvalidate();
            updateNodeVisibility();
        }
    }

    private void requestStyles(boolean force) {
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
            item.setHidden(mInitialLayoutPassCompleted && item.getStyle() != null && !item.isAncestor());
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

        Rect ancestorLayout = style.getLayout();
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
        Rect startLayout = (startStyle != null) ? normalizeLayout(startStyle.getLayout(), startAncestor) : new Rect();
        Rect endLayout = (endStyle != null) ? normalizeLayout(endStyle.getLayout(), endAncestor) : new Rect();

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
    
        // Local data
        RNSharedElementTransitionItem startItem = mItems.get(ITEM_START);
        RNSharedElementTransitionItem startAncestor = mItems.get(ITEM_START_ANCESTOR);
        RNSharedElementTransitionItem endItem = mItems.get(ITEM_END);
        RNSharedElementTransitionItem endAncestor = mItems.get(ITEM_END_ANCESTOR);

        // Prepare operations
        /*getLocationOnScreen(mParentLocation);*/

        // Get start layout
        RNSharedElementStyle startStyle = startItem.getStyle();
        //Rect startLayout = (startStyle != null) ? normalizeLayout(startStyle.getLayout(), startAncestor) : new Rect();

        // Get end layout
        RNSharedElementStyle endStyle = endItem.getStyle();
        //Rect endLayout = (endStyle != null) ? normalizeLayout(endStyle.getLayout(), endAncestor) : new Rect();

        // Get interpolated style & layout
        /*Rect interpolatedLayout;
        if ((startStyle == null) && (endStyle == null)) return;
        if ((startStyle != null) && (endStyle != null)) {
            interpolatedLayout = getInterpolatedLayout(startLayout, endLayout, mNodePosition);
        } else if (startStyle != null) {
            interpolatedLayout = startLayout;
        } else {
            interpolatedLayout = endLayout;
        }

        Log.d(LOG_TAG, "onDraw " + mNodePosition + ", interpolatedLayout: " + interpolatedLayout);*/

        // Draw content
        /*Paint paint = new Paint();
        paint.setColor(Color.rgb(255, 0, 0));
        canvas.drawRect(0, 0, getWidth(), getHeight(), paint);*/

        // Draw content
        if (startStyle != null) {
            //Log.d(LOG_TAG, "onDraw: width: " + getWidth() + ", height:" + getHeight());
            startStyle.getView().draw(canvas);
        }
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