package com.ijzerenhein.sharedelement;

public class RNSharedElementTransitionItem extends Object{
    private RNSharedElementNodeManager mNodeManager;
    private String mName;
    private boolean mIsParent;
    private RNSharedElementNode mNode = null;

    public RNSharedElementTransitionItem(RNSharedElementNodeManager nodeManager, String name, boolean isParent) {
        mNodeManager = nodeManager;
        mName = name;
        mIsParent = isParent;
    }

    public String getName() {
        return mName;
    }

    public boolean isParent() {
        return mIsParent;
    }

    public RNSharedElementNode getNode() {
        return mNode;
    }

    public setNode(RNSharedElementNode node) {
        mNode = node;
    }
}