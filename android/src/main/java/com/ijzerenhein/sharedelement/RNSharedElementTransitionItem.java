package com.ijzerenhein.sharedelement;

import android.view.View;
import android.view.ViewParent;
import android.graphics.Rect;

public class RNSharedElementTransitionItem extends Object{
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

    public RNSharedElementTransitionItem(RNSharedElementNodeManager nodeManager, String name, boolean isAncestor) {
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

    public String getName() {
        return mName;
    }

    public boolean isAncestor() {
        return mIsAncestor;
    }

    public void setHidden(boolean hidden) {
        if (mHidden == hidden) return;
        mHidden = hidden;
        if (hidden) {
            mNode.addHideRef();
        } else {
            mNode.releaseHideRef();
        }
    }

    public boolean getHidden() {
        return mHidden;
    }

    public RNSharedElementNode getNode() {
        return mNode;
    }

    public void setNode(RNSharedElementNode node) {
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

    public boolean getNeedsStyle() {
        return mNeedsStyle;
    }

    public void setNeedsStyle(boolean needsStyle) {
        mNeedsStyle = needsStyle;
    }

    public void setStyle(RNSharedElementStyle style) {
        mStyle = style;
    }

    public RNSharedElementStyle getStyle() {
        return mStyle;
    }

    public boolean getNeedsContent() {
        return mNeedsContent;
    }

    public void setNeedsContent(boolean needsContent) {
        mNeedsContent = needsContent;
    }

    public void setContent(RNSharedElementContent content) {
        mContent = content;
    }

    public RNSharedElementContent getContent() {
        return mContent;
    }

    public View getView() {
        // TODO
        return null;
    }

    public Rect getClippedLayout(RNSharedElementTransitionItem ancestor) {
        if (mClippedLayoutCache != null) return mClippedLayoutCache;
        if ((mStyle == null) || (ancestor == null)) return null;
        View view = getView();
        View ancestorView = ancestor.getView();

        // Get visible area (some parts may be clipped in a scrollview or something)
        Rect clippedLayout = mStyle.layout;
        ViewParent parentView = view.getParent();
        while (parentView != null) {
            // TODO
            /*CGRect superLayout = [superview convertRect:superview.bounds toView:nil];
            CGRect intersectedLayout = CGRectIntersection(visibleLayout, superLayout);
            if (isinf(intersectedLayout.origin.x) || isinf(intersectedLayout.origin.y)) break;
            visibleLayout = intersectedLayout;*/
            if (parentView == ancestorView) break;
            parentView = parentView.getParent();
        }
        mClippedLayoutCache = clippedLayout;
        return clippedLayout;
    }
}