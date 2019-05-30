//
//  RNVisualCloneData.h
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 18/01/2019.
//

#ifndef RNVisualCloneData_h
#define RNVisualCloneData_h

@interface RNVisualCloneData : NSObject

@property (readonly, nonatomic) NSNumber* sourceView;
@property (readonly, nonatomic) UIView* snapshot;
@property (readonly, nonatomic) UIImage* image;
// @property (readonly, nonatomic) CGRect layout;
@property (nonatomic) long refCount;

- (instancetype)init:(NSNumber *)sourceView;

@end


#endif /* RNVisualCloneData_h */
