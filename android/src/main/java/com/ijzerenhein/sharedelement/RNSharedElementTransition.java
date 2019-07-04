package com.ijzerenhein.sharedelement;

import java.util.ArrayList;

import android.graphics.Canvas;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class RNSharedElementTransition extends ReactViewGroup {

    static String LOG_TAG = "RNSharedElementTransition";

    static int ITEM_START_ANCESTOR = 0;
    static int ITEM_END_ANCESTOR = 1;
    static int ITEM_START = 2;
    static int ITEM_END = 3;

    private String mAnimation = "move";
    private float mNodePosition = 0.0f;
    private ArrayList<RNSharedElementTransitionItem> mItems = new ArrayList<RNSharedElementTransitionItem>();

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
    }

    public void setEndNode(RNSharedElementNode node) {
        mItems.get(ITEM_END).setNode(node);
    }

    public void setStartAncestor(RNSharedElementNode node) {
        mItems.get(ITEM_START_ANCESTOR).setNode(node);
    }

    public void setEndAncestor(RNSharedElementNode node) {
        mItems.get(ITEM_END_ANCESTOR).setNode(node);
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