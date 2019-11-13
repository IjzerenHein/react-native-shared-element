//
//  RNSharedElementContent_m
//  react-native-shared-element
//

#import "RNSharedElementContent.h"

@implementation RNSharedElementContent
{
    // nop
}

+ (BOOL) isKindOfImageView:(UIView*) view
{
    return (
        [view isKindOfClass:[UIImageView class]] ||
        [NSStringFromClass(view.class) isEqualToString:@"RCTImageView"]
    );
}

+ (UIImageView*) imageViewFromView:(UIView*) view
{
    if ([view isKindOfClass:[UIImageView class]]) {
        return (UIImageView*) view;
    } else if ([NSStringFromClass(view.class) isEqualToString:@"RCTImageView"]) {
        // As of react-native 0.60, RCTImageView is no longer inherited from
        // UIImageView, but has a UIImageView as child. That will cause this code-path
        // to be executed, where the first child view is returned.
        return (UIImageView*) view.subviews.firstObject;
    } else {
        // Error
        return nil;
    }
}

@end
