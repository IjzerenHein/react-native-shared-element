//
//  RNVisualCloneManager.m
//  react-native-visual-clone
//

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

#import "RNVisualCloneManager.h"
#import "RNVisualClone.h"
#import "RNVisualCloneSourceManager.h"

@implementation RNVisualCloneManager
{
    RNVisualCloneSourceManager* _sourceManager;
}

RCT_EXPORT_MODULE(RNVisualClone);

- (instancetype) init
{
    if ((self = [super init])) {
        _sourceManager = [[RNVisualCloneSourceManager alloc]init];
    }
    return self;
}

- (UIView *)view
{
    return [[RNVisualClone alloc] initWithSourceManager:_sourceManager];
}

- (dispatch_queue_t)methodQueue
{
    return self.bridge.uiManager.methodQueue;
}

RCT_EXPORT_VIEW_PROPERTY(autoHide, BOOL);
RCT_EXPORT_VIEW_PROPERTY(value, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(animation, NSString);
RCT_CUSTOM_VIEW_PROPERTY(sources, NSArray, RNVisualClone)
{
    if (json) {
        NSMutableArray* sources = [[NSMutableArray alloc]init];
        for (NSNumber* reactTag in json) {
            if ([reactTag isKindOfClass:[NSNumber class]]) {
                UIView *sourceView = [self.bridge.uiManager viewForReactTag:reactTag];
                RNVisualCloneSource* source = [_sourceManager acquire:reactTag view:sourceView];
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
