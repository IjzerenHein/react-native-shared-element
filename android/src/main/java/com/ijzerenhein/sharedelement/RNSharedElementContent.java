package com.ijzerenhein.sharedelement;

import android.view.View;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewBackgroundDrawable;

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
            if (controllerDetails.contains("fetchedImage=0,")) {
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
          0,
          0,
          style.layout.width(),
          style.layout.height()
        );
        drawable.setBounds(bounds);
        hierarchy.setActualImageScaleType(style.scaleType);
        RoundingParams roundingParams = new RoundingParams();
        roundingParams.setBorderColor(style.borderColor);
        roundingParams.setBorderWidth(style.borderWidth);
        roundingParams.setRoundingMethod(RoundingParams.RoundingMethod.BITMAP_ONLY);
        roundingParams.setCornersRadii(
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius
        );
        hierarchy.setRoundingParams(roundingParams);
        hierarchy.setBackgroundImage(null);
        hierarchy.setFadeDuration(0);

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
        ReactViewGroup viewGroup = (ReactViewGroup) view;
        
        // Save canvas
        canvas.save();

        // Adjust scale
        canvas.scale(
            (float)style.layout.width() / (float)view.getWidth(),
            (float)style.layout.height() / (float)view.getHeight()
        );

        //
        //viewGroup.setOpacityIfPossible(style.opacity);

        // Adjust border radius
        // TODO - correct for scaling
        /*viewGroup.setBorderRadius(style.borderTopLeftRadius, 0);
        viewGroup.setBorderRadius(style.borderTopRightRadius, 1);
        viewGroup.setBorderRadius(style.borderBottomRightRadius, 2);
        viewGroup.setBorderRadius(style.borderBottomLeftRadius, 3);*/

        // Draw!
        view.draw(canvas);

        // Restore canvas
        canvas.save();
    }

    private void drawViewStyles(Canvas canvas, RNSharedElementStyle style) {

        // Create drawable
        ReactViewBackgroundDrawable drawable = new ReactViewBackgroundDrawable(view.getContext());
        Rect bounds = new Rect(
          0,
          0,
          style.layout.width(),
          style.layout.height()
        );
        drawable.setBounds(bounds);

        // Set background color
        drawable.setColor(style.backgroundColor);

        // Set border
        float borderColorRGB = (float) ((int)style.borderColor & 0x00FFFFFF);
        float borderColorAlpha = (float) ((int)style.borderColor >>> 24);
        drawable.setBorderStyle(style.borderStyle);
        for (int i = 0; i < 4; i++) {
            drawable.setBorderColor(i, borderColorRGB, borderColorAlpha);
            drawable.setBorderWidth(i, style.borderWidth);
        }
        drawable.setRadius(style.borderTopLeftRadius, 0);
        drawable.setRadius(style.borderTopRightRadius, 1);
        drawable.setRadius(style.borderBottomRightRadius, 2);
        drawable.setRadius(style.borderBottomLeftRadius, 3);

        // Draw!
        drawable.draw(canvas);
    }

    public void draw(Canvas canvas, RNSharedElementStyle style) {
        if (view instanceof ReactImageView) {
            drawReactImageView(canvas, style);
        }
        else if (view instanceof ReactViewGroup) {
            ReactViewGroup viewGroup = (ReactViewGroup) view;
            if (viewGroup.getChildCount() == 0) {
                drawViewStyles(canvas, style);
            }
            else {
                drawReactViewGroup(canvas, style);
            }
        }
    }
}
