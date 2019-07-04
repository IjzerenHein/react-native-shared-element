package com.ijzerenhein.sharedelement;

import java.util.*;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class RNSharedElementPackage implements ReactPackage {
    private RNSharedElementNodeManager nodeManager = new RNSharedElementNodeManager();

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new RNSharedElementModule(reactContext, this.nodeManager));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new RNSharedElementTransitionManager(reactContext, this.nodeManager));
    }
}
