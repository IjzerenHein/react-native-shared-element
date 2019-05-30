//
//  RNVisualClone.h
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 16/01/2019.
//

#ifndef RNVisualClone_h
#define RNVisualClone_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "RNVisualCloneDataManager.h"

typedef NS_ENUM(NSInteger, RNVisualCloneContentType) {
    RNVisualCloneContentTypeChildren = 0,
    RNVisualCloneContentTypeSnapshot = 1,
    RNVisualCloneContentTypeRawImage = 2
};


@interface RNVisualClone : RCTView

@property (nonatomic, assign) NSNumber* source;
@property (nonatomic, assign) RNVisualCloneContentType contentType;
@property (nonatomic, assign) CGFloat blurRadius;

- (instancetype)initWithDataManager:(RNVisualCloneDataManager*)dataManager;

// - (void) setInitialData:(RNVisualCloneData*)data contentType:(MMContentType)contentType;

@end

#endif /* RNVisualClone_h */
