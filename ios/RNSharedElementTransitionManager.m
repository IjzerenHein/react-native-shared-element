//
//  RNSharedElementTransitionManager.m
//  react-native-shared-element-transition
//

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import "RNSharedElementTransitionManager.h"
#import "RNSharedElementTransition.h"
#import "RNSharedElementSourceManager.h"

@implementation RNSharedElementTransitionManager
{
    RNSharedElementSourceManager* _sourceManager;
}

RCT_EXPORT_MODULE(RNSharedElementTransition);

- (instancetype) init
{
    if ((self = [super init])) {
        _sourceManager = [[RNSharedElementSourceManager alloc]init];
    }
    return self;
}

- (UIView *)view
{
    return [[RNSharedElementTransition alloc] initWithSourceManager:_sourceManager];
}

- (dispatch_queue_t)methodQueue
{
    return self.bridge.uiManager.methodQueue;
}

RCT_EXPORT_VIEW_PROPERTY(autoHide, BOOL);
RCT_EXPORT_VIEW_PROPERTY(value, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(animation, NSString);
RCT_CUSTOM_VIEW_PROPERTY(sources, NSArray, RNSharedElementTransition)
{
    if (json) {
        NSMutableArray* sources = [[NSMutableArray alloc]init];
        for (NSNumber* reactTag in json) {
            if ([reactTag isKindOfClass:[NSNumber class]]) {
                UIView *sourceView = [self.bridge.uiManager viewForReactTag:reactTag];
                RNSharedElementSource* source = [_sourceManager acquire:reactTag view:sourceView];
                [sources addObject:source];
            }
        }
        view.sources = sources;
    }
    else {
        view.sources = @[];
    }
}

RCT_REMAP_METHOD(configure,
                 config:(NSDictionary *)config
                 reactTag:(nonnull NSNumber *)reactTag
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    // DUMMY
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
