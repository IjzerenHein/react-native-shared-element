//
//  RNVisualCloneData.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneData_h
#define RNVisualCloneData_h

@interface RNVisualCloneData : NSObject

@property (nonatomic, weak) UIView* view;
@property (nonatomic, readonly) UIView* snapshot;
@property (nonatomic, readonly) UIImage* image;
@property (nonatomic, assign) CGSize size;

// - (void) invalidate();


@end


#endif /* RNVisualCloneData_h */
