package com.ijzerenhein.sharedelement;

import java.util.Map;
import java.util.HashMap;

import android.view.View;
import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;

class RNSharedElementNodeManager {
    private Map<Integer, RNSharedElementNode> mNodes = new HashMap<Integer, RNSharedElementNode>();
    private NativeViewHierarchyManager mNativeViewHierarchyManager;
    private Context mContext;

    void setNativeViewHierarchyManager(NativeViewHierarchyManager nativeViewHierarchyManager) {
        mNativeViewHierarchyManager = nativeViewHierarchyManager;
    }

    NativeViewHierarchyManager getNativeViewHierarchyManager() {
        return mNativeViewHierarchyManager;
    }

    void setContext(Context context) {
        mContext = context;
    }

    Context getContext() {
        return mContext;
    }

    RNSharedElementNode acquire(int reactTag, View view, boolean isParent, View ancestor, ReadableMap styleConfig) {
        synchronized (mNodes) {
            RNSharedElementNode node = mNodes.get(reactTag);
            if (node != null) {
                node.setRefCount(node.getRefCount() + 1);
                return node;
            }
            node = new RNSharedElementNode(reactTag, view, isParent, ancestor, styleConfig, mContext);
            mNodes.put(reactTag, node);
            return node;
        }
    }

    int release(RNSharedElementNode node) {
        synchronized (mNodes) {
            node.setRefCount(node.getRefCount() - 1);
            if (node.getRefCount() == 0) {
                mNodes.remove(node.getReactTag());
            }
            return node.getRefCount();
        }
    }
}