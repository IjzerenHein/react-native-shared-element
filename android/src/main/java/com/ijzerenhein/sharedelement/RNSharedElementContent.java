package com.ijzerenhein.sharedelement;

import android.view.View;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.graphics.Canvas;

import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.view.ReactViewGroup;

import com.facebook.drawee.view.GenericDraweeView;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.drawable.ScalingUtils.ScaleType;
import com.facebook.drawee.generic.RoundingParams;

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
            Drawable drawable = imageView.getDrawable();
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

    private void drawReactImageView(Canvas canvas, RNSharedElementStyle style) {
        ReactImageView imageView = (ReactImageView) view;
        DraweeController controller = imageView.getController();
        GenericDraweeHierarchy hierarchy = imageView.getHierarchy();
        Drawable drawable = hierarchy.getTopLevelDrawable();

        // Backup current props
        Rect oldBounds = drawable.getBounds();
        ScaleType oldScaleType = hierarchy.getActualImageScaleType();
        RoundingParams oldRoundingParams = hierarchy.getRoundingParams();
        Drawable oldBackgroundImage = null; //hierarchy.getBackgroundImage();
        int oldFadeDuration = hierarchy.getFadeDuration();

        // Configure drawable
        Rect bounds = new Rect(
            style.frame.left - style.layout.left,
            style.frame.top - style.layout.top,
            (style.frame.left - style.layout.left) + style.frame.width(),
            (style.frame.top - style.layout.top) + style.frame.height()
        );
        hierarchy.setActualImageScaleType(ScaleType.FIT_XY);
        RoundingParams roundingParams = new RoundingParams();
        roundingParams.setBorderColor(style.borderColor);
        roundingParams.setBorderWidth(style.borderWidth);
        roundingParams.setRoundingMethod(RoundingParams.RoundingMethod.BITMAP_ONLY);
        /*roundingParams.setCornersRadii(
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius
        );*/
        //roundingParams.setRoundAsCircle(true);
        roundingParams.setCornersRadii(
            20,
            20,
            20,
            20
        );
        hierarchy.setRoundingParams(roundingParams);
        hierarchy.setBackgroundImage(null);
        hierarchy.setFadeDuration(0);
        drawable.setBounds(bounds);

        // Draw!
        drawable.draw(canvas);

        // Restore props
        hierarchy.setFadeDuration(oldFadeDuration);
        hierarchy.setBackgroundImage(oldBackgroundImage);
        hierarchy.setRoundingParams(oldRoundingParams);
        hierarchy.setActualImageScaleType(oldScaleType);
        drawable.setBounds(oldBounds);
    }

    private void drawReactViewGroup(Canvas canvas, RNSharedElementStyle style) {
        // TODO
    }

    public void draw(Canvas canvas, RNSharedElementStyle style) {
        if (view instanceof ReactImageView) {
            drawReactImageView(canvas, style);
        }
        else if (view instanceof ReactViewGroup) {
            drawReactViewGroup(canvas, style);
        }
    }
}
