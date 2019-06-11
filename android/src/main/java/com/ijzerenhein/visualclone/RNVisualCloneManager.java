package com.ijzerenhein.visualclone;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.views.view.ReactViewGroup;

public class RNSharedElementManager extends ReactViewManager {

    private RNSharedElementDataManager mCloneDataManager;

    public static final String REACT_CLASS = "RNSharedElement";

    RNSharedElementManager(RNSharedElementDataManager cloneDataManager) {
        super();
        mCloneDataManager = cloneDataManager;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactViewGroup createViewInstance(ThemedReactContext context) {
        return new RNSharedElementView(context, mCloneDataManager);
    }

    @Override
    public void onDropViewInstance(ReactViewGroup view) {
        super.onDropViewInstance(view);
        ((RNSharedElementView) view).releaseData();
    }

    @ReactProp(name = "id")
    public void setId(final RNSharedElementView view, final String id) {
        view.setId(id);
    }

    @ReactProp(name = "options")
    public void setOptions(final RNSharedElementView view, final int options) {
        view.setOptions(options);
    }

    @ReactProp(name = "contentType")
    public void setContentType(final RNSharedElementView view, final int contentType) {
        view.setContentType(contentType);
    }

    @ReactProp(name = "blurRadius", defaultFloat = 0.0f)
    public void setBlurRadius(final RNSharedElementView view, final float blurRadius) {
        view.setBlurRadius(blurRadius);
    }
}