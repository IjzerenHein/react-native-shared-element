//
//  RNVisualCloneManager.m
//  react-native-visual-clone
//

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>

#import "RNVisualCloneManager.h"
#import "RNVisualClone.h"
#import "RNVisualCloneSourceManager.h"
#import "RNVisualCloneSource.h"

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

RCT_EXPORT_VIEW_PROPERTY(contentType, RNVisualCloneContentType);
RCT_EXPORT_VIEW_PROPERTY(resizeMode, RCTResizeMode)
RCT_EXPORT_VIEW_PROPERTY(autoHide, BOOL);
RCT_EXPORT_VIEW_PROPERTY(value, CGFloat);
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
RCT_EXPORT_VIEW_PROPERTY(onSourceLayout, RCTDirectEventBlock)

RCT_REMAP_METHOD(refresh,
                 config:(NSDictionary *)config
                 reactTag:(nonnull NSNumber *)reactTag
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager prependUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RNVisualClone *view = (RNVisualClone*) viewRegistry[reactTag];
        if (![view isKindOfClass:[RNVisualClone class]]) {
            return RCTLogError(@"[RNVisualClone] Invalid view returned from registry, expecting RNVisualClone, got: %@", view);
        }
        [view refresh];
        resolve(nil);
    }];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
