package com.ijzerenhein.visualclone;

import java.util.Map;
import java.util.HashMap;

public class RNSharedElementDataManager extends Object {
    private Map<String, RNSharedElementData> mItems = new HashMap<String, RNSharedElementData>();

    public RNSharedElementData acquire(String key) {
        synchronized (mItems) {
            RNSharedElementData item = mItems.get(key);
            if (item != null) {
                item.setRefCount(item.getRefCount() + 1);
            }
            return item;
        }
    }

    public int release(RNSharedElementData item) {
        synchronized (mItems) {
            item.setRefCount(item.getRefCount() - 1);
            if (item.getRefCount() == 0) {
                mItems.remove(item.getKey());
            }
            return item.getRefCount();
        }
    }

    public void put(RNSharedElementData item) {
        synchronized (mItems) {
            mItems.put(item.getKey(), item);
        }
    }
}