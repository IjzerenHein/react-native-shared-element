package com.ijzerenhein.sharedelement;

import android.view.View;
import android.graphics.Rect;
import android.graphics.RectF;

import com.facebook.drawee.view.GenericDraweeView;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

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

    static public Rect getLayout(Rect layout, RectF contentSize, ScaleType scaleType, boolean reverse) {
        float width = layout.width();
        float height = layout.height();
        float contentAspectRatio = (contentSize.width() / contentSize.height());
        boolean lo = (width / height) < contentAspectRatio;
        boolean aspectRatioCriteria = reverse ? !lo : lo;
        if (scaleType == ScaleType.FIT_CENTER) {
          // contain
          if (aspectRatioCriteria) {
            height = width / contentAspectRatio;
          } else {
            width = height * contentAspectRatio;
          }
        } else if (scaleType == ScaleType.CENTER_CROP) {
          // cover
          if (aspectRatioCriteria) {
            width = height * contentAspectRatio;
          } else {
            height = width / contentAspectRatio;
          }
        } else if (scaleType == ScaleType.CENTER_INSIDE) {
          // center
          width = contentSize.width();
          height = contentSize.height();
        }
        return new Rect(
          (int) (layout.left + ((layout.width() - width) / 2)),
          (int) (layout.top + ((layout.height() - height) / 2)),
          (int) (layout.right - ((layout.width() - width) / 2)),
          (int) (layout.bottom - ((layout.height() - height) / 2))
        );
    }
}