//
//  RNVisualCloneDataManager.h
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 18/01/2019.
//

#ifndef RNVisualCloneDataManager_h
#define RNVisualCloneDataManager_h

#import "RNVisualCloneData.h"

@interface RNVisualCloneDataManager : NSObject

- (instancetype)init;

- (RNVisualCloneData*) acquire:(NSNumber*) sourceView;
- (long) release:(RNVisualCloneData*) cache;
- (void) put:(RNVisualCloneData*) cache;

@end


#endif /* RNVisualCloneDataManager_h */
