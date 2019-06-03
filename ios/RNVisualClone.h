//
//  RNVisualClone.h
//  react-native-visual-clone
//

#ifndef RNVisualClone_h
#define RNVisualClone_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "RNVisualCloneData.h"
#import "RNVisualCloneDelegate.h"

typedef NS_ENUM(NSInteger, RNVisualCloneContentType) {
    RNVisualCloneContentTypeSnapshot = 0,
    RNVisualCloneContentTypeImage = 1,
    RNVisualCloneContentTypeRawImage = 2
};

@interface RNVisualClone : RCTView <RNVisualCloneDelegate>

@property (nonatomic, strong) RNVisualCloneData* sourceData;
@property (nonatomic, assign) RNVisualCloneContentType contentType;
@property (nonatomic, assign) CGFloat blurRadius;

- (instancetype)init;
- (void)refresh;

@end

#endif /* RNVisualClone_h */
