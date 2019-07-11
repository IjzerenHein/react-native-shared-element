package com.ijzerenhein.sharedelement;

import android.view.View;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;

public class RNSharedElementTransitionManager extends SimpleViewManager<RNSharedElementTransition> {
    private ReactApplicationContext mReactContext;
    private RNSharedElementNodeManager mNodeManager;

    public static final String REACT_CLASS = "RNSharedElementTransition";

    RNSharedElementTransitionManager(ReactApplicationContext reactContext, RNSharedElementNodeManager nodeManager) {
        super();
        mReactContext = reactContext;
        mNodeManager = nodeManager;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RNSharedElementTransition createViewInstance(ThemedReactContext context) {
        return new RNSharedElementTransition(context, mNodeManager);
    }

    @Override
    public void onDropViewInstance(RNSharedElementTransition view) {
        super.onDropViewInstance(view);
        view.releaseData();
    }

    @ReactProp(name = "nodePosition")
    public void setNodePosition(final RNSharedElementTransition view, final float nodePosition) {
        view.setNodePosition(nodePosition);
    }

    @ReactProp(name = "animation")
    public void setAnimation(final RNSharedElementTransition view, final String animation) {
        view.setAnimation(animation);
    }

    private RNSharedElementNode nodeFromMap(final ReadableMap map, final String name) {
        if (map == null) return null;
        if (!map.hasKey(name)) return null;
        final ReadableMap mapItem = map.getMap(name);
        int nodeHandle = mapItem.getInt("nodeHandle");
        boolean isParent = mapItem.getBoolean("isParent");
        ReadableMap styleConfig = mapItem.getMap("nodeStyle");
        View view = mNodeManager.getNativeViewHierarchyManager().resolveView(nodeHandle);
        return mNodeManager.acquire(nodeHandle, view, isParent, styleConfig);
    }

    @ReactProp(name = "startNode")
    public void setStartNode(final RNSharedElementTransition view, final ReadableMap startNode) {
        view.setStartNode(nodeFromMap(startNode, "node"));
        view.setStartAncestor(nodeFromMap(startNode, "ancestor"));
    }

    @ReactProp(name = "endNode")
    public void setEndNode(final RNSharedElementTransition view, final ReadableMap endNode) {
        view.setEndNode(nodeFromMap(endNode, "node"));
        view.setEndAncestor(nodeFromMap(endNode, "ancestor"));
    }
}