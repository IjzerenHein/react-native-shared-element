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

@interface RNVisualClone : RCTView

@property (nonatomic, assign) NSString* id;
@property (nonatomic, assign) MMOptions options;
@property (nonatomic, assign) MMContentType contentType;
@property (nonatomic, assign) CGFloat blurRadius;

- (instancetype)initWithDataManager:(RNVisualCloneDataManager*)dataManager;

- (void) setInitialData:(RNVisualCloneData*)data contentType:(MMContentType)contentType;

@end

#endif /* RNVisualClone_h */
