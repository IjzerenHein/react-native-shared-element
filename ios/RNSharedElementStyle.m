//
//  RNSharedElementStyle.m
//  react-native-shared-element
//

#import "RNSharedElementStyle.h"

@implementation RNSharedElementStyle
{
    UIColor* _backgroundColor;
    UIColor* _borderColor;
    UIColor* _shadowColor;
}

- (instancetype)init
{
    return self;
}

- (void) setBackgroundColor:(UIColor*)backgroundColor {
    _backgroundColor = backgroundColor;
}
- (UIColor*) backgroundColor
{
    return _backgroundColor;
}

- (void) setBorderColor:(UIColor*)borderColor {
    _borderColor = borderColor;
}
- (UIColor*) borderColor
{
    return _borderColor;
}

- (void) setShadowColor:(UIColor*)shadowColor {
    _shadowColor = shadowColor;
}

- (UIColor*)shadowColor
{
    return _shadowColor;
}

+ (NSString*) stringFromTransform:(CATransform3D) transform {
    return [NSString stringWithFormat:@"x=%f, y=%f, z=%f",
            transform.m41, transform.m42, transform.m43];
}

+ (CATransform3D) getAbsoluteViewTransform:(UIView*) view
{
    CATransform3D transform = view.layer.transform;
    view = view.superview;
    while (view != nil) {
        CATransform3D t2 = view.layer.transform;
        // Other transform props are not needed for now, maybe support them later
        /*transform.m11 *= t2.m11;
         transform.m12 *= t2.m12;
         transform.m13 *= t2.m13;
         transform.m14 *= t2.m14;
         transform.m21 *= t2.m21;
         transform.m22 *= t2.m22;
         transform.m23 *= t2.m23;
         transform.m24 *= t2.m24;
         transform.m31 *= t2.m31;
         transform.m32 *= t2.m32;
         transform.m33 *= t2.m33;
         transform.m34 *= t2.m34;*/
        transform.m41 += t2.m41; // translateX
        transform.m42 += t2.m42; // translateY
        transform.m43 += t2.m43; // translateZ
        //transform.m44 *= t2.m44;
        view = view.superview;
    }
    return transform;
}

@end
