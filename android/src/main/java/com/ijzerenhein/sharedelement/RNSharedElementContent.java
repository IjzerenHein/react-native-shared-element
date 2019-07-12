package com.ijzerenhein.sharedelement;

import android.view.View;
import android.graphics.RectF;

import com.facebook.drawee.view.GenericDraweeView;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.interfaces.DraweeController;

public class RNSharedElementContent extends Object {
    public View view;
    public RectF size;

    static public RectF getSize(View view) {
        if (view instanceof GenericDraweeView) {
            GenericDraweeView imageView = (GenericDraweeView) view;
            DraweeController controller = imageView.getController();
            GenericDraweeHierarchy hierarchy = imageView.getHierarchy();
            String controllerDetails = controller.toString();
            if (controllerDetails.contains("fetchedImage=0")) {
                return null;
            }
            RectF imageBounds = new RectF();
            hierarchy.getActualImageBounds(imageBounds);
            return imageBounds;
        }
        return new RectF(0, 0, view.getWidth(), view.getHeight());
    }
}
