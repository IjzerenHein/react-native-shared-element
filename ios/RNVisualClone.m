//
//  RNVisualClone.m
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 16/01/2019.
//

#import <Foundation/Foundation.h>
#import <React/UIView+React.h>
#import "RNVisualClone.h"
#import "RNVisualCloneDataManager.h"
#import "RNVisualCloneBlurEffectWithAmount.h"

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif


@implementation RNVisualClone
{
    RNVisualCloneDataManager* _dataManager;
    RNVisualCloneData* _data;
    UIView* _snapshot;
    UIVisualEffectView* _blurEffectView;
}

@synthesize id = _id;
@synthesize options = _options;
@synthesize contentType = _contentType;

- (instancetype)initWithDataManager:(RNVisualCloneDataManager*)dataManager
{
    if ((self = [super init])) {
        _dataManager = dataManager;
        _data = nil;
        _options = 0;
        _contentType = MMContentTypeChildren;
        _snapshot = nil;
        // self.layer.masksToBounds = YES; // overflow = 'hidden'
    }
    
    return self;
}

- (void)dealloc
{
    if (_data != nil) {
        [_dataManager release:_data];
        _data = nil;
    }
}

- (void)displayLayer:(CALayer *)layer
{
    [super displayLayer:layer];
    
    if (_data == nil) return;
    
    if (_options & MMOptionVisible) {
        if (_contentType == MMContentTypeRawImage) {
            self.layer.contents =  _data.rawImage ? (id)_data.rawImage.CGImage : nil;
        }
    }
}

- (void) reactSetFrame:(CGRect)frame
{
    // This ensures that the initial clone is visible before it has
    // received any styles from the JS side
    if (frame.size.width * frame.size.height) {
        [super reactSetFrame:frame];
    }
}

- (void) setInitialData:(RNVisualCloneData*)data contentType:(MMContentType)contentType
{
    _data = data;
    _options = data.options;
    _contentType = contentType;
    
    if (_options & MMOptionScene) {
        self.layer.masksToBounds = YES; // overflow = 'hidden'
    }
    
    if ((contentType == MMContentTypeSnapshot) && (_options & MMOptionVisible)) {
        _snapshot = [data.snapshot snapshotViewAfterScreenUpdates:NO];
        _snapshot.frame = CGRectMake(0, 0, data.layout.size.width, data.layout.size.height);
        [self addSubview:_snapshot];
    }
    
    [super reactSetFrame:_data.layout];
    [self.layer setNeedsDisplay];
}

- (void)setBlurRadius:(CGFloat)blurRadius
{
    blurRadius = (blurRadius <=__FLT_EPSILON__) ? 0 : blurRadius;
    if (blurRadius != _blurRadius) {
        _blurRadius = blurRadius;
        // DebugLog(@"[RNVisualClone] setBlurRadius: %f", blurRadius);
        //[self.layer setNeedsDisplay];
        
        if (blurRadius) {
            RNVisualCloneBlurEffectWithAmount* blurEffect = [RNVisualCloneBlurEffectWithAmount effectWithStyle:UIBlurEffectStyleLight andBlurAmount:@(blurRadius)];
            if (_blurEffectView == nil) {
                _blurEffectView = [[UIVisualEffectView alloc] init];
                _blurEffectView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
                _blurEffectView.effect = blurEffect;
                _blurEffectView.frame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
                [self addSubview:_blurEffectView];
            }
            else {
                _blurEffectView.effect = blurEffect;
            }
        }
        else if (_blurEffectView) {
            [_blurEffectView removeFromSuperview];
            _blurEffectView = nil;
        }
    }
    
    // image = RCTBlurredImageWithRadius(image, 4.0f);
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ((_data == nil) && (_id != nil)) {
        NSString* key = [RNVisualCloneData keyForSharedId:_id options:_options];
        _data = [_dataManager acquire:key];
    }
    
    if ((_contentType == MMContentTypeSnapshot) && (_options & MMOptionVisible) && (_data != nil) && (_snapshot == nil)) {
        _snapshot = [_data.snapshot snapshotViewAfterScreenUpdates:NO];
        //_snapshot.frame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
        _snapshot.frame = self.bounds;
        _snapshot.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        [self addSubview:_snapshot];
    }
    else if ((_snapshot != nil) && ((_contentType != MMContentTypeSnapshot) || ((_options & MMOptionVisible) == 0))) {
        [_snapshot removeFromSuperview];
        _snapshot = nil;
    }
    
    if (_snapshot) {
        if (_snapshot.autoresizingMask != (UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight)) {
            _snapshot.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        }
    }
    
    [self.layer setNeedsDisplay];
}

@end
