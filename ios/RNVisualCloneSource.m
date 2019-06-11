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
    
    NSMutableArray* _contentRequests;
    NSObject* _contentCache;
    RNVisualCloneContentType _contentTypeCache;
    
    NSMutableArray* _styleRequests;
    RNVisualCloneStyle* _styleCache;
    
    CADisplayLink* _displayLink;
}

@synthesize reactTag = _reactTag;
@synthesize view = _view;

- (instancetype)init:(NSNumber *)reactTag view:(UIView*) view
{
    _reactTag = reactTag;
    _view = view;
    _refCount = 1;
    _hideRefCount = 0;
    _contentRequests = nil;
    _contentCache = nil;
    _contentTypeCache = RNVisualCloneContentTypeSnapshot;
    _styleRequests = nil;
    _styleCache = nil;
    _displayLink = nil;
    [self addObservers];
    return self;
}

- (void) setRefCount:(long)refCount {
    _refCount = refCount;
    if (_refCount == 0) {
        [self removeObservers];
        if (_displayLink != nil) {
            [_displayLink removeFromRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
            _displayLink = nil;
        }
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
    if (_view == nil) return;
    [_view addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    
    if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        [imageView addObserver:self forKeyPath:@"image" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    }
}

- (void) removeObservers
{
    if (_view == nil) return;
    [_view removeObserver:self forKeyPath:@"bounds"];
    
    if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        [imageView removeObserver:self forKeyPath:@"image"];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    // NSLog(@"observeValueForKeyPath: %@", keyPath);
    [self updateStyle];
    [self updateContent];
}

- (void) requestContent:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _contentCache != nil) {
        [delegate didLoadContent:_contentCache contentType:_contentTypeCache source:self];
        return;
    }
    
    if (_contentRequests == nil) _contentRequests = [[NSMutableArray alloc]init];
    [_contentRequests addObject:delegate];
    
    [self updateContent];
}

- (void) updateContent
{
    if (_view == nil) return;
    if (_contentRequests == nil) return;
    
    CGRect bounds = _view.bounds;
    if (!bounds.size.width || !bounds.size.height) {
        return;
    }
    
    // Obtain snapshot content
    NSObject* content;
    RNVisualCloneContentType contentType;
    if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        UIImage* image = imageView.image;
        content = image;
        contentType = RNVisualCloneContentTypeRawImage;
    }
    else {
        NSLog(@"drawViewHierarchyInRect: bounds: %@", NSStringFromCGRect(bounds));
        UIGraphicsBeginImageContextWithOptions(bounds.size, _view.opaque, 0.0f);
        BOOL res = [_view drawViewHierarchyInRect:bounds afterScreenUpdates:NO]; // NEVER USE YES, IT CREATED VISUAL ARTEFACTS ON THE CREEN
        UIImage* image = res ? UIGraphicsGetImageFromCurrentImageContext() : nil;
        UIGraphicsEndImageContext();
        NSLog(@"drawViewHierarchyInRect: RESULT: %ld", res);
        content = image;
        contentType = RNVisualCloneContentTypeImage;
    }
    
    // If the content could not be obtained, then try again later
    if (content == nil) {
        if (_displayLink == nil) {
            _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(onDisplayLinkUpdate:)];
            [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
        }
        return;
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
    
    _contentCache = content;
    _contentTypeCache = contentType;
    
    NSArray* delegates = _contentRequests;
    _contentRequests = nil;
    if (_displayLink != nil) {
        [_displayLink removeFromRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
        _displayLink = nil;
    }
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate didLoadContent:content contentType:contentType source:self];
        }
    }
}

- (void)onDisplayLinkUpdate:(CADisplayLink *)sender
{
    // NSLog(@"onDisplayLinkUpdate");
    [self updateContent];
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
