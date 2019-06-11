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

@interface RCTConvert(RNVisualCloneContentType)
+ (RNVisualCloneContentType)RNVisualCloneContentType:(id)json;
@end

@interface RNVisualClone : UIImageView <RNVisualCloneDelegate>

@property (nonatomic, assign) RNVisualCloneContentType contentType;
@property (nonatomic, assign) RCTResizeMode resizeMode;
@property (nonatomic, assign) BOOL autoHide;
@property (nonatomic, assign) CGFloat value;
@property (nonatomic, assign) NSArray* sources;

- (instancetype)initWithSourceManager:(RNVisualCloneSourceManager*)sourceManager;
- (void)refresh;

@end

#endif /* RNVisualClone_h */
