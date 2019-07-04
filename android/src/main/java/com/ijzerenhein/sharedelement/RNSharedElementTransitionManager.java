package com.ijzerenhein.sharedelement;

import android.view.View;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;

public class RNSharedElementTransitionManager extends ReactViewManager {
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
    public ReactViewGroup createViewInstance(ThemedReactContext context) {
        return new RNSharedElementTransition(context, mNodeManager);
    }

    @Override
    public void onDropViewInstance(ReactViewGroup view) {
        super.onDropViewInstance(view);
        ((RNSharedElementTransition) view).releaseData();
    }

    @ReactProp(name = "nodePosition")
    public void setNodePosition(final RNSharedElementTransition view, final float nodePosition) {
        view.setNodePosition(nodePosition);
    }

    @ReactProp(name = "animation")
    public void setAnimation(final RNSharedElementTransition view, final String animation) {
        view.setAnimation(animation);
    }

    private RNSharedElementNode nodeFromMap(final ReadableMap map) {
        if (map == null) return null;
        UIManagerModule uiManager = mReactContext.getNativeModule(UIManagerModule.class);
        int nodeHandle = map.getInt("nodeHandle");
        boolean isParent = map.getBoolean("isParent");
        /*View view = uiManager
            .getUIImplementation()
            .getUIViewOperationQueue()
            .getNativeViewHierarchyManager()
            .resolveView(nodeHandle);*/
        View view = null;
        return mNodeManager.acquire(nodeHandle, view, isParent);
    }

    @ReactProp(name = "startNode")
    public void setStartNode(final RNSharedElementTransition view, final ReadableMap startNode) {
        view.setStartNode(nodeFromMap(startNode.getMap("node")));
        view.setStartAncestor(nodeFromMap(startNode.getMap("ancestor")));
    }

    @ReactProp(name = "endNode")
    public void setEndNode(final RNSharedElementTransition view, final ReadableMap endNode) {
        view.setEndNode(nodeFromMap(endNode.getMap("node")));
        view.setEndAncestor(nodeFromMap(endNode.getMap("ancestor")));
    }
}