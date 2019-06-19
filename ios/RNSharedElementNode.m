//
//  RNSharedElementNode.m
//  react-native-shared-element-transition
//

#import <UIKit/UIKit.h>
#import "RNSharedElementNode.h"

@implementation RNSharedElementNode
{
    long _refCount;
    long _hideRefCount;
    
    NSMutableArray* _contentRequests;
    NSObject* _contentCache;
    RNSharedElementContentType _contentTypeCache;
    
    NSMutableArray* _styleRequests;
    RNSharedElementStyle* _styleCache;
    
    CADisplayLink* _displayLink;
    
    __weak UIView* _sourceView;
    UIView * _view;
}

@synthesize reactTag = _reactTag;

- (instancetype)init:(NSNumber *)reactTag view:(UIView*) view isParent:(BOOL)isParent
{
    _reactTag = reactTag;
    _sourceView = view;
    _isParent = isParent;
    _refCount = 1;
    _hideRefCount = 0;
    _contentRequests = nil;
    _contentCache = nil;
    _contentTypeCache = RNSharedElementContentTypeSnapshot;
    _styleRequests = nil;
    _styleCache = nil;
    _displayLink = nil;
    if (_isParent) {
        self.view = view.subviews.firstObject;
        [self addContentObservers:_sourceView];
    }
    else {
        self.view = view;
    }
    return self;
}

/*- (void) addChildViewObservers
{
    [_sourceView addObserver:self forKeyPath:@"subviews" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
}

- (void) removeChildViewObservers
{
    [_sourceView removeObserver:self forKeyPath:@"subviews"];
}*/

- (UIView*) view
{
    return _view;
}

- (void) setView:(UIView*) view
{
    if (_view == view) return;
    
    if (_view != nil) {
        if (_hideRefCount) _view.hidden = NO;
        [self removeContentObservers: _view];
    }
    _view = view;
    if (_view != nil) {
        if (_hideRefCount) _view.hidden = YES;
        [self addContentObservers:_view];
    }
}

- (void) addContentObservers:(UIView*)view
{
    [view addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    
    if ([view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) view;
        [imageView addObserver:self forKeyPath:@"image" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    }
}

- (void) removeContentObservers:(UIView*)view
{
    [view removeObserver:self forKeyPath:@"bounds"];
    
    if ([view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) view;
        [imageView removeObserver:self forKeyPath:@"image"];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    //NSLog(@"observeValueForKeyPath: %@, changed: %@", keyPath, change);
    if (_isParent) {
        self.view = _sourceView.subviews.firstObject;
    }
    [self updateStyle];
    [self updateContent];
}

- (void) setRefCount:(long)refCount {
    _refCount = refCount;
    if (_refCount == 0) {
        if (_displayLink != nil) {
            [_displayLink removeFromRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
            _displayLink = nil;
        }
        self.view = nil;
        if (_isParent && (_sourceView != nil)) {
            [self removeContentObservers:_sourceView];
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
        if (_view != nil) _view.hidden = YES;
    }
    else if (_hideRefCount == 0) {
        if (_view != nil) _view.hidden = NO;
    }
}

- (long) hideRefCount
{
    return _hideRefCount;
}

- (void) requestContent:(__weak id <RNSharedElementDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _contentCache != nil) {
        [delegate didLoadContent:_contentCache contentType:_contentTypeCache node:self];
        return;
    }
    
    if (_contentRequests == nil) _contentRequests = [[NSMutableArray alloc]init];
    [_contentRequests addObject:delegate];
    
    [self updateContent];
}

- (void) updateContent
{
    UIView* view = self.view;
    if (view == nil) return;
    if (_contentRequests == nil) return;
    
    CGRect bounds = view.bounds;
    if (!bounds.size.width || !bounds.size.height) {
        return;
    }
    
    // Obtain snapshot content
    NSObject* content;
    RNSharedElementContentType contentType;
    if ([view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) view;
        UIImage* image = imageView.image;
        content = image;
        contentType = RNSharedElementContentTypeRawImage;
    }
    else {
        NSLog(@"drawViewHierarchyInRect: bounds: %@", NSStringFromCGRect(bounds));
        UIGraphicsBeginImageContextWithOptions(bounds.size, view.opaque, 0.0f);
        BOOL res = [view drawViewHierarchyInRect:bounds afterScreenUpdates:NO]; // NEVER USE YES, IT CREATED VISUAL ARTEFACTS ON THE CREEN
        UIImage* image = res ? UIGraphicsGetImageFromCurrentImageContext() : nil;
        UIGraphicsEndImageContext();
        NSLog(@"drawViewHierarchyInRect: RESULT: %li", res);
        content = image;
        contentType = RNSharedElementContentTypeImage;
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
    for (__weak id <RNSharedElementDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate didLoadContent:content contentType:contentType node:self];
        }
    }
}

- (void)onDisplayLinkUpdate:(CADisplayLink *)sender
{
    // NSLog(@"onDisplayLinkUpdate");
    [self updateContent];
}

- (void) requestStyle:(__weak id <RNSharedElementDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _styleCache != nil) {
        [delegate didLoadStyle:_styleCache node:self];
        return;
    }
    
    if (_styleRequests == nil) _styleRequests = [[NSMutableArray alloc]init];
    [_styleRequests addObject:delegate];
    
    [self updateStyle];
}

- (void) updateStyle
{
    UIView* view = self.view;
    if (_styleRequests == nil) return;
    if (view == nil) return;
    
    // Get absolute layout
    CGRect layout = [view convertRect:view.bounds toView:nil];
    // NSLog(@"updateStyle: %@, %@", NSStringFromCGRect(layout), NSStringFromCGRect(view.bounds));
    if (CGRectIsEmpty(layout)) return;
    
    RNSharedElementStyle* style = [[RNSharedElementStyle alloc]init];
    CALayer* layer = view.layer;
    style.layout = layout;
    style.size = view.bounds.size;
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
    for (__weak id <RNSharedElementDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate didLoadStyle:style node:self];
        }
    }
}

- (void) cancelRequests:(id <RNSharedElementDelegate>) delegate
{
    if (_styleRequests != nil) [_styleRequests removeObject:delegate];
    if (_contentRequests != nil) [_contentRequests removeObject:delegate];
}

@end
