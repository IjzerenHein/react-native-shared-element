//
//  RNVisualCloneSource.m
//  react-native-visual-clone
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneSource.h"

@implementation RNVisualCloneStyle
{
    UIColor* _backgroundColor;
    UIColor* _borderColor;
    UIColor* _shadowColor;
}

- (instancetype)init
{
    return self;
}

- (void) setBackgroundColor:(UIColor*)backgroundColor {
    _backgroundColor = backgroundColor;
}
- (UIColor*) backgroundColor
{
    return _backgroundColor;
}

- (void) setBorderColor:(UIColor*)borderColor {
    _borderColor = borderColor;
}
- (UIColor*) borderColor
{
    return _borderColor;
}

- (void) setShadowColor:(UIColor*)shadowColor {
    _shadowColor = shadowColor;
}
- (UIColor*)shadowColor
{
    return _shadowColor;
}

@end


@implementation RNVisualCloneSource
{
    long _refCount;
    long _hideRefCount;
    
    NSMutableArray* _snapshotImageRequests;
    UIImage* _snapshotImageCache;
    
    NSMutableArray* _rawImageRequests;
    UIImage* _rawImageCache;
    
    NSMutableArray* _styleRequests;
    RNVisualCloneStyle* _styleCache;
}

@synthesize reactTag = _reactTag;
@synthesize view = _view;

- (instancetype)init:(NSNumber *)reactTag view:(UIView*) view
{
    _reactTag = reactTag;
    _view = view;
    _refCount = 1;
    _hideRefCount = 0;
    _snapshotImageRequests = nil;
    _snapshotImageCache = nil;
    _rawImageRequests = nil;
    _rawImageCache = nil;
    _styleRequests = nil;
    _styleCache = nil;
    [self addObservers];
    return self;
}

- (void) setRefCount:(long)refCount {
    _refCount = refCount;
    if (_refCount == 0) {
        [self removeObservers];
    }
}

- (long) refCount {
    return _refCount;
}

- (void) setHideRefCount:(long)refCount
{
    _hideRefCount = refCount;
    if (_hideRefCount == 1) {
        _view.hidden = YES;
    }
    else if (_hideRefCount == 0) {
        _view.hidden = NO;
    }
}

- (long) hideRefCount
{
    return _hideRefCount;
}

- (void) addObservers
{
    if (_view != nil) {
        [_view addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    }
    
    if ((_view != nil) && [_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        [imageView addObserver:self forKeyPath:@"image" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    }
}

- (void) removeObservers
{
    if (_view != nil) {
        [_view removeObserver:self forKeyPath:@"bounds"];
    }
    
    if ((_view != nil) &&[_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        [imageView removeObserver:self forKeyPath:@"image"];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"image"]) {
        // NSLog(@"Invalidated because of Image change");
        [self invalidate];
    }
    if ([keyPath isEqualToString:@"bounds"]) {
        // NSLog(@"Invalidated because of Bounds change");
        [self invalidate];
    }
}

- (void) invalidate
{
    [self updateStyle];
    [self updateSnapshotImage];
    [self updateRawImage];
}

/*
 - (UIView*) snapshot
 {
 if (_cachedSnapshot != nil) return _cachedSnapshot;
 if (_view == nil) return nil;
 if (!_size.width || !_size.height) return nil;
 
 if ([_view isKindOfClass:[UIImageView class]]) {
 UIImageView* imageView = (UIImageView*) _view;
 UIImage* image = imageView.image;
 if (image == nil) return nil;
 }
 
 UIView* snapshot = [_view snapshotViewAfterScreenUpdates:YES];
 _cachedSnapshot = snapshot;
 return snapshot;
 }*/


- (void) requestContent:(id <RNVisualCloneDelegate>) delegate contentType:(RNVisualCloneContentType)contentType useCache:(BOOL)useCache
{
    switch (contentType) {
        case RNVisualCloneContentTypeImage:
            [self requestSnapshotImage:delegate useCache:useCache];
            break;
        case RNVisualCloneContentTypeRawImage:
            [self requestRawImage:delegate useCache:useCache];
            break;
        case RNVisualCloneContentTypeSnapshot:
            [self requestSnapshotView:delegate useCache:useCache];
            break;
    }
}

- (void) requestSnapshotImage:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _snapshotImageCache != nil) {
        [delegate didLoadContent:_snapshotImageCache contentType:RNVisualCloneContentTypeImage source:self];
        return;
    }
    
    if (_snapshotImageRequests == nil) _snapshotImageRequests = [[NSMutableArray alloc]init];
    [_snapshotImageRequests addObject:delegate];
    
    [self updateSnapshotImage];
}


- (void) updateSnapshotImage
{
    if (_view == nil) return;
    if (_snapshotImageRequests == nil) return;
    
    CGRect bounds = _view.bounds;
    if (!bounds.size.width || !bounds.size.height) {
        return;
    }
    
    UIImage* image;
    if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        image = imageView.image;
        if (image == nil) return;
    }
    
    NSLog(@"drawViewHierarchyInRect: bounds: %@", NSStringFromCGRect(bounds));
    UIGraphicsBeginImageContextWithOptions(bounds.size, _view.opaque, 0.0f);
    BOOL res = [_view drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
    if (!res) {
        res = [_view drawViewHierarchyInRect:bounds afterScreenUpdates:YES];
    }
    image = res ? UIGraphicsGetImageFromCurrentImageContext() : nil;
    UIGraphicsEndImageContext();
    NSLog(@"drawViewHierarchyInRect: RESULT: %ld", res);
    if (image == nil) return;
    
    _snapshotImageCache = image;
    
    NSArray* delegates = _snapshotImageRequests;
    _snapshotImageRequests = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate didLoadContent:image contentType:RNVisualCloneContentTypeImage source:self];
        }
    }
}

- (void) requestRawImage:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _rawImageCache != nil) {
        [delegate didLoadContent:_rawImageCache contentType:RNVisualCloneContentTypeRawImage source:self];
        return;
    }
    
    if (_rawImageRequests == nil) _rawImageRequests = [[NSMutableArray alloc]init];
    [_rawImageRequests addObject:delegate];
    
    [self updateRawImage];
}


- (void) updateRawImage
{
    if (_rawImageRequests == nil) return;
    if (_view == nil) return;
    
    CGRect bounds = _view.bounds;
    if (!bounds.size.width || !bounds.size.height) {
        return;
    }
    
    UIImage* image;
    if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        image = imageView.image;
        if (image == nil) return;
    }
    
    _rawImageCache = image;
    
    NSArray* delegates = _rawImageRequests;
    _rawImageRequests = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate didLoadContent:image contentType:RNVisualCloneContentTypeRawImage source:self];
        }
    }
}

- (void) requestSnapshotView:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    // TODO
}

- (void) requestStyle:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _styleCache != nil) {
        [delegate didLoadStyle:_styleCache source:self];
        return;
    }
    
    if (_styleRequests == nil) _styleRequests = [[NSMutableArray alloc]init];
    [_styleRequests addObject:delegate];
    
    [self updateStyle];
}

- (void) updateStyle
{
    if (_styleRequests == nil) return;
    if (_view == nil) return;
    
    // Get absolute layout
    CGRect layout = [_view convertRect:_view.bounds toView:nil];
    if (CGRectIsEmpty(layout)) return;
    
    RNVisualCloneStyle* style = [[RNVisualCloneStyle alloc]init];
    CALayer* layer = _view.layer;
    style.layout = layout;
    style.opacity = layer.opacity || 0.0f;
    style.cornerRadius = layer.cornerRadius;
    style.borderWidth = layer.borderWidth;
    style.borderColor = layer.borderColor ? [UIColor colorWithCGColor:layer.borderColor] : [UIColor clearColor];
    style.backgroundColor = layer.backgroundColor ? [UIColor colorWithCGColor:layer.backgroundColor] : [UIColor clearColor];
    style.shadowColor = layer.shadowColor ? [UIColor colorWithCGColor:layer.shadowColor] : [UIColor clearColor];
    style.shadowOffset = layer.shadowOffset;
    style.shadowRadius = layer.shadowRadius;
    style.shadowOpacity = layer.shadowOpacity;
    
    _styleCache = style;
    
    NSArray* delegates = _styleRequests;
    _styleRequests = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate didLoadStyle:style source:self];
        }
    }
}

@end
