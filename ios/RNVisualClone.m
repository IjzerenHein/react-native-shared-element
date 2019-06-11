//
//  RNVisualClone.m
//  react-native-visual-clone
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreImage/CoreImage.h>
#import <React/RCTDefines.h>
#import <React/UIView+React.h>
#import "RNVisualClone.h"
#import "RNVisualCloneImageBlurUtils.h"

RCT_EXTERN UIImage *RCTBlurredImageWithRadius(UIImage *inputImage, CGFloat radius);

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@implementation RCTConvert(RNVisualCloneContentType)
RCT_ENUM_CONVERTER(RNVisualCloneContentType, (@{
                                                @"snapshot": @(RNVisualCloneContentTypeSnapshot),
                                                @"image": @(RNVisualCloneContentTypeImage),
                                                @"rawImage": @(RNVisualCloneContentTypeRawImage),
                                                }), -1, integerValue)
@end

@implementation RCTConvert(RNVisualCloneBlurFilter)
RCT_ENUM_CONVERTER(RNVisualCloneBlurFilter, (@{
                                               @"gaussian": @(RNVisualCloneBlurFilterGaussian),
                                               @"motion": @(RNVisualCloneBlurFilterMotion),
                                               @"zoom": @(RNVisualCloneBlurFilterZoom),
                                               }), -1, integerValue)
@end

@interface RNVisualClone ()
@property (nonatomic, copy) RCTDirectEventBlock onSourceLayout;
@end

@implementation RNVisualClone
{
    RNVisualCloneSourceManager* _sourceManager;
    RNVisualCloneSource* _cloneSource;
    RNVisualCloneContentType _contentType;
    BOOL _needsSourceLayout;
    BOOL _needsSourceReload;
    BOOL _needsImageReload;
    UIImage* _sourceImage;
    CGRect _sourceLayout;
    BOOL _sourceHidden;
    BOOL _hasValidContent;
    BOOL _reactFrameSet;
}

- (instancetype)initWithSourceManager:(RNVisualCloneSourceManager*)sourceManager
{
    if ((self = [super initWithImage:nil])) {
        _sourceManager = sourceManager;
        _cloneSource = nil;
        _contentType = RNVisualCloneContentTypeSnapshot;
        _needsSourceLayout = NO;
        _needsSourceReload = NO;
        _needsImageReload = NO;
        _sourceImage = nil;
        _sourceLayout = CGRectZero;
        _sourceHidden = NO;
        _hasValidContent = NO;
        _reactFrameSet = NO;
    }
    
    return self;
}

- (void)dealloc
{
    if (_cloneSource != nil) {
        if (_sourceHidden) _cloneSource.hideRefCount--;
        [_sourceManager release:_cloneSource];
        _cloneSource = nil;
    }
}

- (void)refresh
{
    [self loadSourceContent:YES];
}

- (void)setSource:(RNVisualCloneSource*)source {
    if (_cloneSource == source) {
        if (_cloneSource) [_sourceManager release:_cloneSource];
        return;
    }
    
    if (_cloneSource != nil) {
        if (_sourceHidden) _cloneSource.hideRefCount--;
        _sourceHidden = NO;
        [_sourceManager release:_cloneSource];
    }
    _cloneSource = source;
    _hasValidContent = NO;
    _needsSourceReload = YES;
    _needsSourceLayout = YES;
}

- (void)setContentType:(RNVisualCloneContentType)contentType {
    if (_contentType != contentType) {
        _contentType = contentType;
        _needsSourceReload = YES;
    }
}

- (void)setResizeMode:(RCTResizeMode)resizeMode
{
    if (_resizeMode != resizeMode) {
        _resizeMode = resizeMode;
        
        if (_resizeMode == RCTResizeModeRepeat) {
            // Repeat resize mode is handled by the UIImage. Use scale to fill
            // so the repeated image fills the UIImageView.
            self.contentMode = UIViewContentModeScaleToFill;
        } else {
            self.contentMode = (UIViewContentMode)resizeMode;
        }
    }
}

- (void)setBlurRadius:(CGFloat)blurRadius
{
    if (blurRadius != _blurRadius) {
        _blurRadius = blurRadius;
        _needsImageReload = YES;
    }
}

- (void)setBlurAngle:(CGFloat)blurAngle
{
    if (blurAngle != _blurAngle) {
        _blurAngle = blurAngle;
        _needsImageReload = YES;
    }
}

- (void)setBlurFilter:(RNVisualCloneBlurFilter)blurFilter
{
    if (blurFilter != _blurFilter) {
        _blurFilter = blurFilter;
        _needsImageReload = YES;
    }
}

- (void)updateSourceHidden
{
    if (_cloneSource == nil) return;
    
    BOOL sourceHidden = _hideSource && _hasValidContent && _reactFrameSet;
    if (_sourceHidden != sourceHidden) {
        _sourceHidden = sourceHidden;
        if (sourceHidden) {
            _cloneSource.hideRefCount++;
        }
        else {
            _cloneSource.hideRefCount--;
        }
    }
}

- (void)setHideSource:(BOOL)hideSource
{
    if (hideSource != _hideSource) {
        _hideSource = hideSource;
        [self updateSourceHidden];
    }
}

- (void) didSetProps:(NSArray<NSString *> *)changedProps
{
    if (_needsSourceLayout) {
        if (_cloneSource != nil) {
            _needsSourceLayout = NO;
            [_cloneSource requestLayout:self useCache:YES];
        }
    }
    if (_needsSourceReload) {
        [self loadSourceContent:NO];
    }
    else if (_needsImageReload) {
        [self reloadImage];
    }
}

- (void) loadSourceContent:(BOOL)forceRefresh
{
    _needsSourceReload = NO;
    if (_cloneSource != nil) {
        switch (_contentType) {
            case RNVisualCloneContentTypeSnapshot:
                [_cloneSource requestSnapshotView:self useCache:!forceRefresh];
                break;
            case RNVisualCloneContentTypeImage:
                [_cloneSource requestSnapshotImage:self useCache:!forceRefresh];
                break;
            case RNVisualCloneContentTypeRawImage:
                [_cloneSource requestRawImage:self useCache:!forceRefresh];
                break;
        }
    }
}

- (void)updateWithImage:(UIImage *)image
{
    if (!image) {
        super.image = nil;
        return;
    }
    
    // Apply rendering mode
    /*if (_renderingMode != image.renderingMode) {
     image = [image imageWithRenderingMode:_renderingMode];
     }
     
     if (_resizeMode == RCTResizeModeRepeat) {
     image = [image resizableImageWithCapInsets:_capInsets resizingMode:UIImageResizingModeTile];
     } else if (!UIEdgeInsetsEqualToEdgeInsets(UIEdgeInsetsZero, _capInsets)) {
     // Applying capInsets of 0 will switch the "resizingMode" of the image to "tile" which is undesired
     image = [image resizableImageWithCapInsets:_capInsets resizingMode:UIImageResizingModeStretch];
     }*/
    
    // Apply trilinear filtering to smooth out mis-sized images
    self.layer.minificationFilter = kCAFilterTrilinear;
    self.layer.magnificationFilter = kCAFilterTrilinear;
    
    NSLog(@"updateWithImage: %@", NSStringFromCGRect(self.frame));
    super.image = image;
    
    if (!_hasValidContent) {
        _hasValidContent = YES;
        [self updateSourceHidden];
    }
}

- (void)reloadImage
{
    _needsImageReload = NO;
    if (_sourceImage != nil && _blurRadius > __FLT_EPSILON__) {
        void (^setImageBlock)(UIImage *) = ^(UIImage *image) {
            [self updateWithImage: image];
        };
        
        // Blur on a background thread to avoid blocking interaction
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            UIImage* blurredImage;
            CIFilter* filter;
            CIContext* context = [CIContext contextWithOptions:@{}];
            CIImage* image;
            NSLog(@"Blurring image...");
            switch (_blurFilter) {
                case RNVisualCloneBlurFilterGaussian:
                    blurredImage = RCTBlurredImageWithRadius(_sourceImage, _blurRadius);
                    break;
                case RNVisualCloneBlurFilterMotion:
                    /*filter = [CIFilter filterWithName: @"CIMotionBlur"];
                     [filter setValue:[[CIImage alloc] initWithImage:_sourceImage] forKey:kCIInputImageKey];
                     [filter setValue:@(_blurRadius) forKey:kCIInputRadiusKey];
                     [filter setValue:@(_blurAngle) forKey:kCIInputAngleKey];
                     image = [filter outputImage];
                     blurredImage = [UIImage imageWithCGImage:[context createCGImage:image fromRect:image.extent]];*/
                    //blurredImage = [UIImage imageWithCIImage:[filter outputImage]];
                    blurredImage = HorizontalMotionBlurImage(_sourceImage, _blurRadius, _blurAngle);
                    break;
                case RNVisualCloneBlurFilterZoom:
                    filter = [CIFilter filterWithName: @"CIZoomBlur"];
                    [filter setValue:[[CIImage alloc] initWithImage:_sourceImage] forKey:kCIInputImageKey];
                    [filter setValue:@(_blurRadius) forKey:kCIInputAmountKey];
                    // [filter setValue:@(_blurAngle) forKey:kCIInputCenterKey];
                    blurredImage = [UIImage imageWithCIImage:[filter outputImage]];
                    break;
            }
            NSLog(@"Blurring image... DONE");
            
            RCTExecuteOnMainQueue(^{
                setImageBlock(blurredImage);
            });
        });
    }
    else {
        [self updateWithImage: _sourceImage];
    }
}

- (void) snapshotImageComplete:(UIImage*) image
{
    _sourceImage = image;
    [self reloadImage];
}

- (void) rawImageComplete:(UIImage*) image
{
    _sourceImage = image;
    [self reloadImage];
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

- (void) reactSetFrame:(CGRect)frame
{
    NSLog(@"reactSetFrame: %@", NSStringFromCGRect(frame));
    
    _reactFrameSet = YES;
    
    if (!CGRectIsEmpty(_sourceLayout) && !(frame.size.width * frame.size.height)) {
        frame = [self.superview convertRect:_sourceLayout fromView:nil];
    }
    [super reactSetFrame:frame];
    
    if (!CGRectIsEmpty(_sourceLayout)) {
        if (_onSourceLayout) {
            CGRect layout = [self.superview convertRect:_sourceLayout fromView:nil];
            _onSourceLayout(@{
                              @"layout": @{
                                      @"x": @(layout.origin.x),
                                      @"y": @(layout.origin.y),
                                      @"width": @(layout.size.width),
                                      @"height": @(layout.size.height)
                                      }});
        }
        _sourceLayout = CGRectZero;
    }
    
    [self updateSourceHidden];
}

- (void) layoutComplete:(CGRect) layout
{
    // NSLog(@"layoutComplete: %@", NSStringFromCGRect(layout));
    
    _sourceLayout = layout;
    
    if (_reactFrameSet) {
        [self reactSetFrame:self.frame];
    }
}

@end
