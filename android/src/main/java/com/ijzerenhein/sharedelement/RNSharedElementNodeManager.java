package com.ijzerenhein.sharedelement;

import java.util.Map;
import java.util.HashMap;

public class RNSharedElementNodeManager extends Object {
    private Map<int, RNSharedElementNode> mNodes = new HashMap<int, RNSharedElementNode>();

    public RNSharedElementNode acquire(int reactTag) {
        synchronized (mNodes) {
            RNSharedElementNode node = mNodes.get(reactTag);
            if (node != null) {
                node.setRefCount(node.getRefCount() + 1);
            }
            return node;
        }
    }

    public int release(RNSharedElementNode node) {
        synchronized (mNodes) {
            node.setRefCount(node.getRefCount() - 1);
            if (node.getRefCount() == 0) {
                mNodes.remove(node.getReactTag());
            }
            return node.getRefCount();
        }
    }
}