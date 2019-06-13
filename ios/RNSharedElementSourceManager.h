//
//  RNSharedElementSourceManager.h
//  react-native-shared-element-transition
//

#ifndef RNSharedElementSourceManager_h
#define RNSharedElementSourceManager_h

#import "RNSharedElementSource.h"

@interface RNSharedElementSourceManager : NSObject

- (instancetype)init;
- (RNSharedElementSource*) acquire:(NSNumber*) reactTag view:(UIView*)view isParent:(BOOL)isParent;
- (long) release:(RNSharedElementSource*) source;

@end

#endif
