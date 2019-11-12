//
//  RNSharedElementContent_m
//  react-native-shared-element
//

#import "RNSharedElementContent.h"
#import <React/RCTImageView.h>

@implementation RNSharedElementContent
{
    // nop
}

+ (BOOL) isKindOfImageView:(UIView*) view
{
    return (
        [view isKindOfClass:[RCTImageView class]] ||
        [view isKindOfClass:[UIImageView class]]
    );
}

+ (UIImageView*) imageViewFromView:(UIView*) view
{
    if ([view isKindOfClass:[UIImageView class]]) {
        return (UIImageView*) view;
    } else if ([view isKindOfClass:[RCTImageView class]]) {
        // As of react-native 0.61.1, RCTImageView is no longer inherited from
        // UIImageView, but has a UIImageView as child. That will cause this code-path
        // to be executed, where the first child view is returned.
        return (UIImageView*) view.subviews.firstObject;
    } else {
        // Error
        return nil;
    }
}

@end
