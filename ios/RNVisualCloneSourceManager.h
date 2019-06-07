//
//  RNVisualCloneSourceManager_h.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneSourceManager_h
#define RNVisualCloneSourceManager_h

#import "RNVisualCloneSource.h"

@interface RNVisualCloneSourceManager : NSObject

- (instancetype)init;

- (RNVisualCloneSource*) acquire:(NSNumber*) reactTag view:(UIView*)view;
- (long) release:(RNVisualCloneSource*) source;

@end


#endif /* RNVisualCloneSourceManager_h */
