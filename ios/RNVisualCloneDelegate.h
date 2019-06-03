//
//  RNVisualCloneDelegate.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneDelegate_h
#define RNVisualCloneDelegate_h

@protocol RNVisualCloneDelegate
- (void) imageSnapshotComplete:(UIImage*) image;
- (void) rawImageSnapshotComplete:(UIImage*) image;
- (void) viewSnapshotComplete:(UIView*) view;
@end


#endif /* RNVisualCloneDelegate_h */
