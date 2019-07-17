package com.ijzerenhein.sharedelement;

import android.view.View;
import android.view.ViewParent;
import android.view.ViewGroup;
import android.graphics.Rect;

class RNSharedElementTransitionItem {
    private RNSharedElementNodeManager mNodeManager;
    private String mName;
    private boolean mIsAncestor;
    private RNSharedElementNode mNode;
    private boolean mHidden;
    private boolean mNeedsStyle;
    private RNSharedElementStyle mStyle;
    private boolean mNeedsContent;
    private RNSharedElementContent mContent;
    private Rect mClippedLayoutCache;

    RNSharedElementTransitionItem(RNSharedElementNodeManager nodeManager, String name, boolean isAncestor) {
        mNodeManager = nodeManager;
        mNode = null;
        mName = name;
        mIsAncestor = isAncestor;
        mHidden = false;
        mNeedsStyle = false;
        mStyle = null;
        mNeedsContent = false;
        mContent = null;
        mClippedLayoutCache = null;
    }

    String getName() {
        return mName;
    }

    boolean isAncestor() {
        return mIsAncestor;
    }

    void setHidden(boolean hidden) {
        if (mHidden == hidden) return;
        mHidden = hidden;
        if (hidden) {
            mNode.addHideRef();
        } else {
            mNode.releaseHideRef();
        }
    }

    boolean getHidden() {
        return mHidden;
    }

    RNSharedElementNode getNode() {
        return mNode;
    }

    void setNode(RNSharedElementNode node) {
        if (mNode == node) {
            if (node != null) mNodeManager.release(node);
            return;
        }
        if (mNode != null) {
            if (mHidden) mNode.releaseHideRef();
            mNodeManager.release(mNode);
        }
        mNode = node;
        mHidden = false;
        mNeedsStyle = node != null;
        mStyle = null;
        mNeedsContent = !mIsAncestor && (node != null);
        mContent = null;
    }

    boolean getNeedsStyle() {
        return mNeedsStyle;
    }

    void setNeedsStyle(boolean needsStyle) {
        mNeedsStyle = needsStyle;
    }

    void setStyle(RNSharedElementStyle style) {
        mStyle = style;
    }

    RNSharedElementStyle getStyle() {
        return mStyle;
    }

    boolean getNeedsContent() {
        return mNeedsContent;
    }

    void setNeedsContent(boolean needsContent) {
        mNeedsContent = needsContent;
    }

    void setContent(RNSharedElementContent content) {
        mContent = content;
    }

    RNSharedElementContent getContent() {
        return mContent;
    }

    View getView() {
        return (mNode != null) ? mNode.getResolvedView() : null;
    }

    Rect getClippedLayout(RNSharedElementTransitionItem ancestor) {
        if (mClippedLayoutCache != null) return mClippedLayoutCache;
        if ((mStyle == null) || (ancestor == null)) return null;
        View view = getView();
        View ancestorView = ancestor.getView();
        
        // Get visible area (some parts may be clipped in a scrollview or something)
        Rect clippedLayout = new Rect(mStyle.layout);
        ViewParent parentView = view.getParent();
        int[] location = new int[2]; 
        while (parentView != null) {
            if (!(parentView instanceof ViewGroup)) break;
            ViewGroup viewGroup = (ViewGroup) parentView;
            viewGroup.getLocationOnScreen(location);
            /*int left = viewGroup.getLeft();
            int top = viewGroup.getTop();
            int right = viewGroup.getRight();
            int bottom = viewGroup.getBottom();
            int width = viewGroup.getWidth();
            int height = viewGroup.getHeight();*/
            //Rect globalVisibilityRect = new Rect();
            //viewGroup.getGlobalVisibleRect(globalVisibilityRect);

            Rect bounds = new Rect(
                location[0],
                location[1],
                location[0] + (viewGroup.getWidth()), 
                location[1] + (viewGroup.getHeight())
            );
            if (!clippedLayout.intersect(bounds)) {
                view.getLocationOnScreen(location);
                clippedLayout.left = location[0] + (int) (view.getWidth() / 2);
                clippedLayout.top = location[1] + (int) (view.getHeight() / 2);
                clippedLayout.right = clippedLayout.left;
                clippedLayout.bottom = clippedLayout.top;
                break;
            }
            if (parentView == ancestorView) break;
            parentView = parentView.getParent();
        }

        mClippedLayoutCache = clippedLayout;
        return clippedLayout;
    }
}