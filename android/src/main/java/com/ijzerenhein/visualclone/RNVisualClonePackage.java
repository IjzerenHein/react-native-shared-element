package com.ijzerenhein.visualclone;

import java.util.*;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class RNSharedElementPackage implements ReactPackage {
    private RNSharedElementDataManager cloneDataManager = new RNSharedElementDataManager();

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new RNSharedElementModule(reactContext, this.cloneDataManager));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new RNSharedElementManager(this.cloneDataManager));
    }
}
