package com.ijzerenhein.sharedelement;

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
}