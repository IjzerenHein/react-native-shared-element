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

public class RNSharedElementDrawable extends Drawable {
    private RNSharedElementContent mContent;

    @Override
    public void draw(Canvas canvas) {
        if (mContent == null) return;

        if (view instanceof ReactImageView) {
            drawReactImageView(canvas);
        }
        /*else if (view instanceof ReactViewGroup) {
            ReactViewGroup viewGroup = (ReactViewGroup) view;
            if (viewGroup.getChildCount() == 0) {
                drawViewStyles(canvas, style);
            }
            else {
                drawReactViewGroup(canvas, style);
            }
        }*/
    }

    @Override
    protected void onBoundsChange(Rect bounds) {
        super.onBoundsChange(bounds);
        //mNeedUpdatePathForBorderRadius = true;
    }

    /* Android's elevation implementation requires this to be implemented to know where to draw the shadow. */
    @Override
    public void getOutline(Outline outline) {
        /*if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
        super.getOutline(outline);
        return;
        }
        if ((!YogaConstants.isUndefined(mBorderRadius) && mBorderRadius > 0) || mBorderCornerRadii != null) {
        updatePath();

        outline.setConvexPath(mPathForBorderRadiusOutline);
        } else {
        outline.setRect(getBounds());
        }*/
    }
}
