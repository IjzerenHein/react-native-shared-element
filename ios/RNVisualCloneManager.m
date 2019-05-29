//
//  RNVisualCloneManager.m
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 16/01/2019.
//

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>

#import "RNVisualCloneManager.h"
#import "RNVisualClone.h"
#import "RNVisualCloneDataManager.h"

@implementation RNVisualCloneManager
{
    RNVisualCloneDataManager* _dataManager;
}

RCT_EXPORT_MODULE();

- (instancetype) init
{
    if ((self = [super init])) {
        _dataManager = [[RNVisualCloneDataManager alloc]init];
    }
    return self;
}

- (UIView *)view
{
    return [[RNVisualClone alloc] initWithDataManager:_dataManager];
}

- (dispatch_queue_t)methodQueue
{
    return self.bridge.uiManager.methodQueue;
}

RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_EXPORT_VIEW_PROPERTY(options, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(contentType, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(blurRadius, CGFloat);

RCT_REMAP_METHOD(init,
                 config:(NSDictionary *)config
                 reactTag:(nonnull NSNumber *)reactTag
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    // Destructure options
    NSString* sharedId = config[@"id"];
    MMOptions options = [config[@"options"] intValue];
    MMContentType contentType = [config[@"contentType"] intValue];
    NSNumber* sourceTag = config[@"source"];
    NSNumber* parentTag = config[@"parent"];
    
    // Get shadow views
    RCTShadowView* sourceShadowView = [self.bridge.uiManager shadowViewForReactTag:sourceTag];
    RCTShadowView* parentShadowView = [self.bridge.uiManager shadowViewForReactTag:parentTag];
    
    // Ref to data manager
    RNVisualCloneDataManager* dataManager = _dataManager;
    
    // Wait for the layout engine (yoga) to layout the node
    // If the node has not yet been layed out, it will wait a bit and retry
    void (^__block calculateLayout)(void) = ^{
        CGRect uncorrectedLayout = [sourceShadowView measureLayoutRelativeToAncestor:parentShadowView];
        
        // If the layout is not yet available, try again in a bit
        if (!(uncorrectedLayout.size.width * uncorrectedLayout.size.height)) {
            // NSLog(@"[RNVisualClone] calculateLayout failed for view %@, retrying...", sharedId);
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(4 * NSEC_PER_MSEC));
            dispatch_after(popTime, self.bridge.uiManager.methodQueue, calculateLayout);
            return;
        }
        // NSLog(@"[RNVisualClone] calculateLayout succeeded for view %@, width: %lf..., height: %lf", sharedId, uncorrectedLayout.size.width, uncorrectedLayout.size.height);
        
        // And inform the clone of the layout and other props
        [self.bridge.uiManager prependUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
            // NSLog(@"[RNVisualClone] Prepend UI block complete for view %@", sharedId);
            RNVisualClone *view = (RNVisualClone*) viewRegistry[reactTag];
            if (![view isKindOfClass:[RNVisualClone class]]) {
                return RCTLogError(@"[RNVisualClone] Invalid view returned from registry, expecting RNVisualClone, got: %@", view);
            }
            
            // Get source view
            UIView *sourceView = viewRegistry[sourceTag];
            if (sourceView == nil) {
                return RCTLogError(@"[RNVisualClone] Invalid source tag specified, not found in registry: %@", sourceTag);
            }
            
            // Get parent view
            UIView *parentView = (RNVisualClone*) viewRegistry[parentTag];
            if (parentView == nil) {
                return RCTLogError(@"[RNVisualClone] Invalid source tag specified, not found in registry: %@", sourceTag);
            }
            
            // Calculate relative coordinates from source to parent
            CGRect layout = [sourceView convertRect:sourceView.bounds toView:parentView];
            
            // Prepare result
            NSMutableDictionary* result = [[NSMutableDictionary alloc]init];
            [result setObject:@(layout.size.width) forKey:@"width"];
            [result setObject:@(layout.size.height) forKey:@"height"];
            [result setObject:@(layout.origin.x) forKey:@"x"];
            [result setObject:@(layout.origin.y) forKey:@"y"];
            
            // Get snapshot
            UIView *snapshot;
            if ((options & MMOptionScene) == 0) {
                /*CGRect bounds = layout;
                 bounds.origin.x = 0;
                 bounds.origin.y = 0;
                 //NSLog(@"drawViewHierarchyInRect...");
                 UIGraphicsBeginImageContextWithOptions(layout.size, (options & MMOptionScene) ? YES : NO, 0.0f);
                 [sourceView drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
                 snapshotImage = UIGraphicsGetImageFromCurrentImageContext();
                 UIGraphicsEndImageContext();
                 //NSLog(@"drawViewHierarchyInRect... DONE");*/
                //NSLog(@"snapshotViewAfterScreenUpdates...");
                snapshot = [sourceView snapshotViewAfterScreenUpdates:YES];
                //NSLog(@"snapshotViewAfterScreenUpdates... DONE");
            }
            
            // Get raw image
            UIImage *rawImage = nil;
            if ([sourceView isKindOfClass:[UIImageView class]]) {
                UIImageView* sourceImageView = (UIImageView*) sourceView;
                rawImage = sourceImageView.image;
                [result setObject:@(rawImage.size.width * rawImage.scale) forKey:@"imageWidth"];
                [result setObject:@(rawImage.size.height * rawImage.scale) forKey:@"imageHeight"];
            }
            
            // Upon success, send notification with the result
            resolve(result);
            
            // Create data object
            RNVisualCloneData* data = [[RNVisualCloneData alloc]init:sharedId reactTag:sourceTag layout:layout options:options snapshot:snapshot rawImage:rawImage];
            [dataManager put:data];
            [view setInitialData:data contentType:contentType];
            calculateLayout = nil;
        }];
    };
    calculateLayout();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
