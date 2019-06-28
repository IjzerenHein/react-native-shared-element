//
//  RNSharedElementStyle_h
//  react-native-shared-element-transition
//

#ifndef RNSharedElementStyle_h
#define RNSharedElementStyle_h

#import <UIKit/UIKit.h>

@interface RNSharedElementStyle : NSObject
@property (nonatomic, assign) UIView* view;
@property (nonatomic, assign) CGRect layout;
@property (nonatomic, assign) CGSize size;
@property (nonatomic, assign) UIViewContentMode contentMode;
@property (nonatomic, assign) CGFloat opacity;
@property (nonatomic, assign) UIColor* backgroundColor;
@property (nonatomic, assign) CGFloat cornerRadius;
@property (nonatomic, assign) CGFloat borderWidth;
@property (nonatomic, assign) UIColor* borderColor;
@property (nonatomic, assign) CGFloat shadowOpacity;
@property (nonatomic, assign) CGFloat shadowRadius;
@property (nonatomic, assign) CGSize shadowOffset;
@property (nonatomic, assign) UIColor* shadowColor;
- (instancetype)init;
@end

#endif
