//
//  RNSharedElementContent_h
//  react-native-shared-element
//

#ifndef RNSharedElementContent_h
#define RNSharedElementContent_h

#import <UIKit/UIKit.h>

@interface RNSharedElementContent : NSObject
+ (BOOL) isKindOfImageView:(UIView*) view;
+ (UIImageView*) imageViewFromView:(UIView*) view;
@end

#endif
