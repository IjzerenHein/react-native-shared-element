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
- (void) layoutComplete:(CGRect) layout;
@end


#endif /* RNVisualCloneDelegate_h */
