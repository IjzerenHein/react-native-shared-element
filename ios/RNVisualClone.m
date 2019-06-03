//
//  RNVisualClone.m
//  react-native-visual-clone
//

#import <Foundation/Foundation.h>
#import <React/UIView+React.h>
#import "RNVisualClone.h"
#import "RNVisualCloneBlurEffectWithAmount.h"

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@implementation RNVisualClone
{
    BOOL _invalidated;
    RNVisualCloneData* _sourceData;
    RNVisualCloneContentType _contentType;
    CGFloat _blurRadius;
    UIView* _snapshot;
    UIImage* _image;
    //UIVisualEffectView* _blurEffectView;
}

- (instancetype)init
{
    if ((self = [super init])) {
        _invalidated = NO;
        _contentType = RNVisualCloneContentTypeSnapshot;
        _blurRadius = 0.0f;
        //_snapshot = nil;
        // self.layer.masksToBounds = YES; // overflow = 'hidden'
    }
    
    return self;
}

- (void)dealloc
{
    /*if (_sourceData) {
        [_sourceData removeObserver:self forKeyPath:@"image"];
        [_sourceData removeObserver:self forKeyPath:@"snapshot"];
    }*/
}

- (void)displayLayer:(CALayer *)layer
{
    [super displayLayer:layer];
    
    if ((_contentType == RNVisualCloneContentTypeImage) || (_contentType == RNVisualCloneContentTypeRawImage)) {
        self.layer.contents =  _image ? (id)_image.CGImage : nil;
    }
}

- (void)setSourceData:(RNVisualCloneData *)sourceData {
    if (_sourceData != sourceData) {
        /*if (_sourceData) {
            [_sourceData removeObserver:self forKeyPath:@"image"];
            [_sourceData removeObserver:self forKeyPath:@"snapshot"];
        }
        if (sourceData) {
            [sourceData addObserver:self forKeyPath:@"image" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
            [sourceData addObserver:self forKeyPath:@"snapshot" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
        }*/
        _sourceData = sourceData;
        _invalidated = YES;
    }
}

- (void)setContentType:(RNVisualCloneContentType)contentType {
    if (_contentType != contentType) {
        _contentType = contentType;
        _invalidated = YES;
    }
}

- (void)setBlurRadius:(CGFloat)blurRadius
{
    blurRadius = (blurRadius <=__FLT_EPSILON__) ? 0 : blurRadius;
    if (blurRadius != _blurRadius) {
        _blurRadius = blurRadius;
        _invalidated = YES;
    }
    
    /*blurRadius = (blurRadius <=__FLT_EPSILON__) ? 0 : blurRadius;
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
    }*/
    
    // image = RCTBlurredImageWithRadius(image, 4.0f);
}

/*
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"image"] || [keyPath isEqualToString:@"snapshot"]) {
        _invalidated = YES;
        [self updateContent];
    }
}*/

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if (!_invalidated) return;
    [self updateContent];
}

- (void)updateContent {
    _invalidated = NO;
    
    if (_sourceData != nil) {
        switch (_contentType) {
            case RNVisualCloneContentTypeSnapshot:
                [_sourceData requestViewSnapshot:self];
                break;
            case RNVisualCloneContentTypeImage:
                [_sourceData requestImageSnapshot:self];
                break;
            case RNVisualCloneContentTypeRawImage:
                [_sourceData requestRawImageSnapshot:self];
                break;
        }
    }
}

- (void) imageSnapshotComplete:(UIImage*) image
{
    // Update image. The image is shown by setting the image to
    // the layer.content prop in `displayLayer`
    _image = image;
    [self.layer setNeedsDisplay];
}

- (void) rawImageSnapshotComplete:(UIImage*) image
{
    // Update image. The image is shown by setting the image to
    // the layer.content prop in `displayLayer`
    _image = image;
    [self.layer setNeedsDisplay];
}

- (void) viewSnapshotComplete:(UIView*) view
{
    // Update snapshot
    /*if (snapshot != _snapshot) {
        if (snapshot != nil) {
            snapshot.frame = self.bounds;
            snapshot.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
            [self addSubview:snapshot];
        }
        if (_snapshot != nil) {
            [_snapshot removeFromSuperview];
        }
        _snapshot = snapshot;
        DebugLog(@"Number of subviews: %ld", self.subviews.count);
    }*/
    
    /*
     if (_snapshot) {
     if (_snapshot.autoresizingMask != (UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight)) {
     _snapshot.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
     }
     }*/
}

@end
