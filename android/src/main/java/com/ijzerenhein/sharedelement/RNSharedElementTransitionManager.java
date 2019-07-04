package com.ijzerenhein.sharedelement;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.bridge.ReadableMap;

public class RNSharedElementTransitionManager extends ReactViewManager {

    private RNSharedElementNodeManager mNodeManager;

    public static final String REACT_CLASS = "RNSharedElementTransition";

    RNSharedElementTransitionManager(RNSharedElementNodeManager nodeManager) {
        super();
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
        view.setAnimation(id);
    }

    @ReactProp(name = "startNode")
    public void setStartNode(final RNSharedElementView view, final ReadableMap startNode) {
        //view.setStartNode(startNode);
    }

    @ReactProp(name = "endNode")
    public void setEndNode(final RNSharedElementView view, final ReadableMap endNode) {
        // view.setEndNode(endNode);
    }
}