package com.ijzerenhein.visualclone;

import java.util.Map;
import java.util.HashMap;

public class RNVisualCloneDataManager extends Object {
    private Map<String, RNVisualCloneData> mItems = new HashMap<String, RNVisualCloneData>();

    public RNVisualCloneData acquire(String key) {
        synchronized (mItems) {
            RNVisualCloneData item = mItems.get(key);
            if (item != null) {
                item.setRefCount(item.getRefCount() + 1);
            }
            return item;
        }
    }

    public int release(RNVisualCloneData item) {
        synchronized (mItems) {
            item.setRefCount(item.getRefCount() - 1);
            if (item.getRefCount() == 0) {
                mItems.remove(item.getKey());
            }
            return item.getRefCount();
        }
    }

    public void put(RNVisualCloneData item) {
        synchronized (mItems) {
            mItems.put(item.getKey(), item);
        }
    }
}