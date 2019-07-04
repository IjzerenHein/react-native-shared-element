package com.ijzerenhein.sharedelement;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class RNSharedElementModule extends ReactContextBaseJavaModule {
    private RNSharedElementNodeManager mNodeManager;

    static String LOG_TAG = "RNSharedElementModule";

    public RNSharedElementModule(ReactApplicationContext reactContext,
            RNSharedElementNodeManager nodeManager) {
        super(reactContext);
        mNodeManager = nodeManager;
    }

    @Override
    public String getName() {
        return "RNSharedElementTransition";
    }

    @ReactMethod
    public void configure(final ReadableMap config, final Promise promise) {
        // TODO
    }
}