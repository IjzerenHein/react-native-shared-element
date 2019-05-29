package com.ijzerenhein.visualclone;

import android.view.View;
import android.os.Handler;
import android.graphics.Rect;
import android.graphics.RectF;
import android.view.ViewGroup;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

public class RNVisualCloneModule extends ReactContextBaseJavaModule {
    private RNVisualCloneDataManager mCloneDataManager;

    static String LOG_TAG = "RNVisualClone";

    public RNVisualCloneModule(ReactApplicationContext reactContext,
            RNVisualCloneDataManager cloneDataManager) {
        super(reactContext);
        mCloneDataManager = cloneDataManager;
    }

    @Override
    public String getName() {
        return "VisualCloneManager";
    }

    @ReactMethod
    public void init(final ReadableMap config, final int tag, final Promise promise) {

        // Deconstruct config
        final String sharedId = config.getString("id");
        final int options = config.getInt("options");
        final int contentType = config.getInt("contentType");
        final int sourceTag = config.getInt("source");
        final int parentTag = config.getInt("parent");

        final ReactApplicationContext context = getReactApplicationContext();
        final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        final RNVisualCloneDataManager cloneDataManager = mCloneDataManager;
        final Handler handler = new Handler();

        // Called whenever the view has been successfully measured
        // or the number of measure retries has been exceeded.
        final Callback measureSuccessCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                Float x = ((Float) args[0]).floatValue();
                Float y = ((Float) args[1]).floatValue();
                Float width = ((Float) args[2]).floatValue();
                Float height = ((Float) args[3]).floatValue();
                final RectF initialLayout = new RectF(x, y, x + width, y + height);

                if ((width == 0f) || (height == 0f)) {
                    // promise.reject("measure_failed", "measureLayout returned 0 for width/height
                    // after 3 times");
                    width = 100f;
                    height = 100f;
                }

                // Get source view
                uiManager.prependUIBlock(new UIBlock() {
                    @Override
                    public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {

                        // Get views
                        RNVisualCloneView view = (RNVisualCloneView) nativeViewHierarchyManager
                                .resolveView(tag);
                        View sourceView = nativeViewHierarchyManager.resolveView(sourceTag);
                        ViewGroup parentView = (ViewGroup) nativeViewHierarchyManager.resolveView(parentTag);

                        // Calculate adjusted position
                        Rect rawLayout = new Rect();
                        sourceView.getDrawingRect(rawLayout);
                        parentView.offsetDescendantRectToMyCoords(sourceView, rawLayout);
                        final RectF layout = new RectF(PixelUtil.toDIPFromPixel(rawLayout.left),
                                PixelUtil.toDIPFromPixel(rawLayout.top), PixelUtil.toDIPFromPixel(rawLayout.right),
                                PixelUtil.toDIPFromPixel(rawLayout.bottom));

                        // Update the layout props for the view
                        handler.post(new Runnable() {
                            @Override
                            public void run() {
                                WritableMap styles = Arguments.createMap();
                                styles.putString("position", "absolute");
                                styles.putDouble("left", layout.left);
                                styles.putDouble("top", layout.top);
                                styles.putDouble("width", layout.width());
                                styles.putDouble("height", layout.height());
                                styles.putInt("backgroundColor", 1); // This is a bit hackish
                                styles.putString("overflow", "hidden");
                                uiManager.updateView(tag, "RNVisualClone", styles);
                            }
                        });

                        // Prepare result
                        final WritableMap result = Arguments.createMap();
                        result.putDouble("x", layout.left);
                        result.putDouble("y", layout.top);
                        result.putDouble("width", layout.width());
                        result.putDouble("height", layout.height());

                        // Resolve promise with result
                        promise.resolve(result);

                        // Create clone data object
                        RNVisualCloneData data = new RNVisualCloneData(sharedId, sourceView, layout,
                                options);
                        cloneDataManager.put(data);
                        view.setInitialData(data, options, contentType);
                    }
                });
            }
        };

        // Called when the measure has failed for some reason
        // I've never seen that this method has been called
        final Callback measureErrorCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                String err = ((String) args[0]).toString();
                promise.reject("measure_failed", err);
            }
        };

        // Try a couple times to measure the layout.
        // I know, I know, this solution down here is a "regelrechte" mess.
        // I couldn't figure out how to do a generic delayed retry mechanism
        // without tripping up Java...
        // If you read this code and you know how to (without using external libs),
        // let me know at: https://github.com/IjzerenHein/react-native-visual-clone
        uiManager.measureLayout(sourceTag, parentTag, measureErrorCallback, new Callback() {
            @Override
            public void invoke(Object... args) {
                if (((Float) args[2]).floatValue() == 0f || ((Float) args[3]).floatValue() == 0f) {
                    // Log.d(LOG_TAG, "Retrying layout #1...");
                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            uiManager.measureLayout(sourceTag, parentTag, measureErrorCallback, new Callback() {
                                @Override
                                public void invoke(Object... args) {
                                    if (((Float) args[2]).floatValue() == 0f || ((Float) args[3]).floatValue() == 0f) {
                                        // Log.d(LOG_TAG, "Retrying layout #2...");
                                        handler.postDelayed(new Runnable() {
                                            @Override
                                            public void run() {
                                                uiManager.measureLayout(sourceTag, parentTag, measureErrorCallback,
                                                        new Callback() {
                                                            @Override
                                                            public void invoke(Object... args) {
                                                                if (((Float) args[2]).floatValue() == 0f
                                                                        || ((Float) args[3]).floatValue() == 0f) {
                                                                    // Log.d(LOG_TAG, "Retrying layout #3...");
                                                                    handler.postDelayed(new Runnable() {
                                                                        @Override
                                                                        public void run() {
                                                                            uiManager.measureLayout(sourceTag,
                                                                                    parentTag, measureErrorCallback,
                                                                                    measureSuccessCallback);
                                                                        }
                                                                    }, 8);
                                                                } else {
                                                                    measureSuccessCallback.invoke(args);
                                                                }
                                                            }
                                                        });
                                            }
                                        }, 4);
                                    } else {
                                        measureSuccessCallback.invoke(args);
                                    }
                                }
                            });
                        }
                    }, 4);
                } else {
                    measureSuccessCallback.invoke(args);
                }
            }
        });
    }
}