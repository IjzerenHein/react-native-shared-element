package com.ijzerenhein.sharedelement;

import android.graphics.Rect;
import android.graphics.Color;

import com.facebook.drawee.drawable.ScalingUtils.ScaleType;

public class RNSharedElementStyle extends Object {
    public Rect layout = new Rect(); // absolute layout on screen
    public Rect frame = new Rect(); // frame rect relative to parent
    public float contentWidth = 0;
    public float contentHeight = 0;
    public ScaleType scaleType = ScaleType.FIT_XY;
    public int backgroundColor = Color.TRANSPARENT;
    public float opacity = 1;
    public float borderTopLeftRadius = 0;
    public float borderTopRightRadius = 0;
    public float borderBottomLeftRadius = 0;
    public float borderBottomRightRadius = 0;
    public float borderWidth = 0;
    public int borderColor = Color.TRANSPARENT;
    public float elevation = 0;

    public Rect getContentLayout(Rect layout, boolean reverse) {
      float width = layout.width();
      float height = layout.height();
      float contentAspectRatio = (contentWidth / contentHeight);
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
        width = contentWidth;
        height = contentHeight;
      }
      return new Rect(
        (int) (layout.left + ((layout.width() - width) / 2)),
        (int) (layout.top + ((layout.height() - height) / 2)),
        (int) (layout.right - ((layout.width() - width) / 2)),
        (int) (layout.bottom - ((layout.height() - height) / 2))
      );
    }
}


    /*+ (CGRect) contentLayoutFor:(CGRect)layout content:(id)content contentType:(RNSharedElementContentType)contentType contentMode:(UIViewContentMode) contentMode reverse:(BOOL)reverse
{
    if (!content) return layout;
    if (contentType != RNSharedElementContentTypeRawImage) return layout;
    CGSize size = layout.size;
    CGSize contentSize = [RNSharedElementTransitionItem contentSizeFor:layout content:content contentType:contentType];
    CGFloat contentAspectRatio = (contentSize.width / contentSize.height);
    BOOL lo = (size.width / size.height) < contentAspectRatio;
    BOOL aspectRatioCriteria = reverse ? !lo : lo;
    switch (contentMode) {
        case UIViewContentModeScaleToFill: // stretch
            break;
        case UIViewContentModeScaleAspectFit: // contain
            if (aspectRatioCriteria) {
                size.height = size.width / contentAspectRatio;
            } else {
                size.width = size.height * contentAspectRatio;
            }
            break;
        case UIViewContentModeScaleAspectFill: // cover
            if (aspectRatioCriteria) {
                size.width = size.height * contentAspectRatio;
            } else {
                size.height = size.width / contentAspectRatio;
            }
            break;
        case UIViewContentModeCenter: // center
            size = contentSize;
            break;
        default:
            break;
    }
    CGRect contentLayout = layout;
    contentLayout.origin.x += (contentLayout.size.width - size.width) / 2;
    contentLayout.origin.y += (contentLayout.size.height - size.height) / 2;
    contentLayout.size = size;
    return contentLayout;
}*/
