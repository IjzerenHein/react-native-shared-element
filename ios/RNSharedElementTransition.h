//
//  RNSharedElementTransition.h
//  react-native-shared-element-transition
//

#ifndef RNSharedElementTransition_h
#define RNSharedElementTransition_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "RNSharedElementSourceManager.h"
#import "RNSharedElementDelegate.h"

@interface RNSharedElementTransition : UIView <RNSharedElementDelegate>

@property (nonatomic, assign) BOOL autoHide;
@property (nonatomic, assign) CGFloat value;
@property (nonatomic, assign) NSString* animation;
@property (nonatomic, assign) NSArray* sources;

- (instancetype)initWithSourceManager:(RNSharedElementSourceManager*)sourceManager;

@end

#endif
