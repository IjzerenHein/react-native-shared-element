//
//  RNVisualClone.h
//  react-native-visual-clone
//

#ifndef RNVisualClone_h
#define RNVisualClone_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import <React/RCTResizeMode.h>
#import <React/RCTConvert.h>
#import "RNVisualCloneSourceManager.h"
#import "RNVisualCloneDelegate.h"

@interface RNVisualClone : UIView <RNVisualCloneDelegate>

@property (nonatomic, assign) BOOL autoHide;
@property (nonatomic, assign) CGFloat value;
@property (nonatomic, assign) NSString* animation;
@property (nonatomic, assign) NSArray* sources;

- (instancetype)initWithSourceManager:(RNVisualCloneSourceManager*)sourceManager;

@end

#endif /* RNVisualClone_h */
