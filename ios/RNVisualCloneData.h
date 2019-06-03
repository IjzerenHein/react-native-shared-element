//
//  RNVisualCloneData.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneData_h
#define RNVisualCloneData_h

#import "RNVisualCloneDelegate.h"

@interface RNVisualCloneData : NSObject

@property (nonatomic, weak) UIView* view;
@property (nonatomic, readonly) UIView* snapshot;
@property (nonatomic, readonly) UIImage* image;
@property (nonatomic, assign) CGSize size;

- (void) requestImageSnapshot:(id <RNVisualCloneDelegate>) delegate;
- (void) requestRawImageSnapshot:(id <RNVisualCloneDelegate>) delegate;
- (void) requestViewSnapshot:(id <RNVisualCloneDelegate>) delegate;

// - (void) invalidate();


@end


#endif /* RNVisualCloneData_h */
