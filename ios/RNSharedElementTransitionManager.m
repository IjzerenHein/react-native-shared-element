//
//  RNSharedElementTransitionManager.m
//  react-native-shared-element-transition
//

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import "RNSharedElementTransitionManager.h"
#import "RNSharedElementTransition.h"
#import "RNSharedElementNodeManager.h"

@implementation RNSharedElementTransitionManager
{
    RNSharedElementNodeManager* _nodeManager;
}

RCT_EXPORT_MODULE(RNSharedElementTransition);

- (instancetype) init
{
    if ((self = [super init])) {
        _nodeManager = [[RNSharedElementNodeManager alloc]init];
    }
    return self;
}

- (UIView *)view
{
    return [[RNSharedElementTransition alloc] initWithnodeManager:_nodeManager];
}

- (dispatch_queue_t)methodQueue
{
    return self.bridge.uiManager.methodQueue;
}

- (RNSharedElementNode*) nodeFromJson:(NSDictionary*)json
{
    if (json == nil) return nil;
    NSNumber* nodeHandle = [json valueForKey:@"nodeHandle"];
    NSNumber* isParent =[json valueForKey:@"isParent"];
    if ([nodeHandle isKindOfClass:[NSNumber class]]) {
        UIView *sourceView = [self.bridge.uiManager viewForReactTag:nodeHandle];
        return [_nodeManager acquire:nodeHandle view:sourceView isParent:[isParent boolValue]];
    }
    return nil;
}

RCT_EXPORT_VIEW_PROPERTY(autoHide, BOOL);
RCT_EXPORT_VIEW_PROPERTY(value, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(animation, NSString);
RCT_CUSTOM_VIEW_PROPERTY(startNode, NSObject, RNSharedElementTransition)
{
    view.startNode = [self nodeFromJson:[json valueForKey:@"node"]];
    view.startAncestor = [self nodeFromJson:[json valueForKey:@"ancestor"]];
}
RCT_CUSTOM_VIEW_PROPERTY(endNode, NSObject, RNSharedElementTransition)
{
    view.endNode = [self nodeFromJson:[json valueForKey:@"node"]];
    view.endAncestor = [self nodeFromJson:[json valueForKey:@"ancestor"]];
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
