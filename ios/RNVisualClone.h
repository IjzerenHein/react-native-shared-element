//
//  RNVisualClone.h
//  react-native-visual-clone
//

#ifndef RNVisualClone_h
#define RNVisualClone_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import <React/RCTResizeMode.h>
#import <React/RCTConvert.h>
#import "RNVisualCloneSourceManager.h"
#import "RNVisualCloneDelegate.h"

typedef NS_ENUM(NSInteger, RNVisualCloneContentType) {
    RNVisualCloneContentTypeSnapshot = 0,
    RNVisualCloneContentTypeImage = 1,
    RNVisualCloneContentTypeRawImage = 2
};

@interface RCTConvert(RNVisualCloneContentType)
+ (RNVisualCloneContentType)RNVisualCloneContentType:(id)json;
@end

typedef NS_ENUM(NSInteger, RNVisualCloneBlurFilter) {
    RNVisualCloneBlurFilterGaussian = 0,
    RNVisualCloneBlurFilterMotion = 1,
    RNVisualCloneBlurFilterZoom = 2
};

@interface RCTConvert(RNVisualCloneBlurFilter)
+ (RNVisualCloneBlurFilter)RNVisualCloneBlurFilter:(id)json;
@end



@interface RNVisualClone : UIImageView <RNVisualCloneDelegate>

@property (nonatomic, assign) RNVisualCloneContentType contentType;
@property (nonatomic, assign) CGFloat blurRadius;
@property (nonatomic, assign) CGFloat blurAngle;
@property (nonatomic, assign) RNVisualCloneBlurFilter blurFilter;
@property (nonatomic, assign) RCTResizeMode resizeMode;
@property (nonatomic, assign) BOOL hideSource;
@property (nonatomic, assign) BOOL useSourceLayout;

- (instancetype)initWithSourceManager:(RNVisualCloneSourceManager*)sourceManager;
- (void)setCloneSource:(NSNumber*)reactTag view:(UIView*)view;
- (void)refresh;

@end

#endif /* RNVisualClone_h */
