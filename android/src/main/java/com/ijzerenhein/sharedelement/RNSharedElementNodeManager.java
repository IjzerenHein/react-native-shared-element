package com.ijzerenhein.sharedelement;

import java.util.Map;
import java.util.HashMap;

public class RNSharedElementNodeManager extends Object {
    private Map<String, RNSharedElementNode> mItems = new HashMap<String, RNSharedElementNode>();

    public RNSharedElementNode acquire(String key) {
        synchronized (mItems) {
            RNSharedElementData item = mItems.get(key);
            if (item != null) {
                item.setRefCount(item.getRefCount() + 1);
            }
            return item;
        }
    }

    public int release(RNSharedElementNode item) {
        synchronized (mItems) {
            item.setRefCount(item.getRefCount() - 1);
            if (item.getRefCount() == 0) {
                mItems.remove(item.getKey());
            }
            return item.getRefCount();
        }
    }

    public void put(RNSharedElementNode item) {
        synchronized (mItems) {
            mItems.put(item.getKey(), item);
        }
    }
}