package com.ijzerenhein.sharedelement;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;

public class RNSharedElementModule extends ReactContextBaseJavaModule {
    private RNSharedElementNodeManager mNodeManager;

    static String LOG_TAG = "RNSharedElementModule";

    public RNSharedElementModule(ReactApplicationContext reactContext, RNSharedElementNodeManager nodeManager) {
        super(reactContext);
        mNodeManager = nodeManager;
    }

    @Override
    public String getName() {
        return "RNSharedElementTransition";
    }

    @ReactMethod
    public void configure(final ReadableMap config, final Promise promise) {

        // Store a reference to the native view manager in the node-manager.
        // This is done so that we can efficiently resolve a view when the 
        // start- and end props are set on the Transition view.
        final ReactApplicationContext context = getReactApplicationContext();
        final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        uiManager.prependUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                mNodeManager.setNativeViewHierarchyManager(nativeViewHierarchyManager);
            }
        });
    }
}