//
//  RNVisualCloneSource.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneSource_h
#define RNVisualCloneSource_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "RNVisualCloneData.h"

@interface RNVisualCloneSource : RCTView

@property (nonatomic, assign) BOOL autoHide;

- (instancetype)init;

- (RNVisualCloneData*) getData;

@end

#endif /* RNVisualCloneSource_h */
