//
//  RNVisualClone.m
//  react-native-visual-clone
//

#import <Foundation/Foundation.h>
#import <React/UIView+React.h>
#import "RNVisualClone.h"

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@implementation RNVisualClone
{
    RNVisualCloneSourceManager* _sourceManager;
    RNVisualCloneSource* _cloneSource;
    RNVisualCloneContentType _contentType;
    BOOL _invalidated;
    CGFloat _blurRadius;
    UIView* _snapshot;
    UIImage* _image;
    //UIVisualEffectView* _blurEffectView;
}

- (instancetype)initWithSourceManager:(RNVisualCloneSourceManager*)sourceManager
{
    if ((self = [super init])) {
        _sourceManager = sourceManager;
        _cloneSource = nil;
        _contentType = RNVisualCloneContentTypeSnapshot;
        _invalidated = NO;
        _blurRadius = 0.0f;
        //_snapshot = nil;
        // self.layer.masksToBounds = YES; // overflow = 'hidden'
    }
    
    return self;
}

- (void)dealloc
{
    if (_cloneSource != nil) {
        [_sourceManager release:_cloneSource];
        _cloneSource = nil;
    }
}

/*
- (void)displayLayer:(CALayer *)layer
{
    [super displayLayer:layer];
    
    if ((_contentType == RNVisualCloneContentTypeImage) || (_contentType == RNVisualCloneContentTypeRawImage)) {
        self.layer.contents =  _image ? (id)_image.CGImage : nil;
    }
}*/

- (void)refresh
{
    _invalidated = YES;
    [self updateContent:NO];
}

- (void)setCloneSource:(NSNumber*)reactTag view:(UIView*)view {
    RNVisualCloneSource* source = [_sourceManager acquire:reactTag view:view];
    if (_cloneSource != nil) {
        [_sourceManager release:_cloneSource];
    }
    if (_cloneSource != source) {
        _cloneSource = source;
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
    // TODO
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
    [self updateContent:YES];
}

- (void)updateContent:(BOOL)useCache {
    if (!_invalidated) return;
    _invalidated = NO;
    
    if (_cloneSource != nil) {
        switch (_contentType) {
            case RNVisualCloneContentTypeSnapshot:
                [_cloneSource requestSnapshotView:self useCache:useCache];
                break;
            case RNVisualCloneContentTypeImage:
                [_cloneSource requestSnapshotImage:self useCache:useCache];
                break;
            case RNVisualCloneContentTypeRawImage:
                [_cloneSource requestRawImage:self useCache:useCache];
                break;
        }
    }
}

- (void) snapshotImageComplete:(UIImage*) image
{
    // Update image. The image is shown by setting the image to
    // the layer.content prop in `displayLayer`
    _image = image;
    [self.layer setNeedsDisplay];
}

- (void) rawImageComplete:(UIImage*) image
{
    // Update image. The image is shown by setting the image to
    // the layer.content prop in `displayLayer`
    _image = image;
    [self.layer setNeedsDisplay];
}

- (void) snapshotViewComplete:(UIView*) view
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
