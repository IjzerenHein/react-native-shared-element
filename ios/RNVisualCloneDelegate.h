//
//  RNVisualCloneDelegate.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneDelegate_h
#define RNVisualCloneDelegate_h

@protocol RNVisualCloneDelegate
- (void) snapshotImageComplete:(UIImage*) image;
- (void) rawImageComplete:(UIImage*) image;
- (void) snapshotViewComplete:(UIView*) view;
@end


#endif /* RNVisualCloneDelegate_h */
