//
//  RNVisualCloneDelegate.h
//  react-native-visual-clone
//

#ifndef RNVisualCloneDelegate_h
#define RNVisualCloneDelegate_h

typedef NS_ENUM(NSInteger, RNVisualCloneContentType) {
    RNVisualCloneContentTypeSnapshot = 0,
    RNVisualCloneContentTypeImage = 1,
    RNVisualCloneContentTypeRawImage = 2
};

@interface RNVisualCloneStyle : NSObject
@property (nonatomic, assign) CGRect layout;
@property (nonatomic, assign) CGFloat opacity;
@property (nonatomic, assign) UIColor* backgroundColor;
@property (nonatomic, assign) CGFloat cornerRadius;
@property (nonatomic, assign) CGFloat borderWidth;
@property (nonatomic, assign) UIColor* borderColor;
@property (nonatomic, assign) CGFloat shadowOpacity;
@property (nonatomic, assign) CGFloat shadowRadius;
@property (nonatomic, assign) CGSize shadowOffset;
@property (nonatomic, assign) UIColor* shadowColor;
- (instancetype)init;
@end

@protocol RNVisualCloneDelegate
- (void) didLoadStyle:(RNVisualCloneStyle*)style source:(id)source;
- (void) didLoadContent:(id)content contentType:(RNVisualCloneContentType)contentType source:(id)source;
@end


#endif /* RNVisualCloneDelegate_h */
