//
//  RNVisualCloneSource.m
//  react-native-visual-clone
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneSource.h"

@implementation RNVisualCloneSource

@synthesize reactTag = _reactTag;
@synthesize view = _view;
@synthesize size = _size;

long _refCount;

NSMutableArray* _snapshotImageRequests;
UIImage* _snapshotImageCache;

NSMutableArray* _rawImageRequests;
UIImage* _rawImageCache;

- (instancetype)init:(NSNumber *)reactTag view:(UIView*) view
{
  _reactTag = reactTag;
  _view = view;
  _refCount = 1;
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
        NSLog(@"Invalidated because of Image change");
        [self invalidate];
    }
    if ([keyPath isEqualToString:@"bounds"]) {
        NSLog(@"Invalidated because of Bounds change");
        [self invalidate];
    }
}

- (void) invalidate
{
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



- (void) requestSnapshotImage:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _snapshotImageCache != nil) {
        [delegate snapshotImageComplete:_snapshotImageCache];
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
    BOOL res = [_view drawViewHierarchyInRect:bounds afterScreenUpdates:YES];
    if (!res) {
        res = [_view drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
    }
    image = res ? UIGraphicsGetImageFromCurrentImageContext() : nil;
    UIGraphicsEndImageContext();
    NSLog(@"drawViewHierarchyInRect: RESULT: %ld", res);
    if (image == nil) return;
    
    NSArray* delegates = _snapshotImageRequests;
    _snapshotImageRequests = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate snapshotImageComplete:image];
        }
    }
}

- (void) requestRawImage:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    if (useCache && _rawImageCache != nil) {
        [delegate rawImageComplete:_rawImageCache];
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
    
    NSArray* delegates = _rawImageRequests;
    _rawImageRequests = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate rawImageComplete:image];
        }
    }
}

- (void) requestSnapshotView:(__weak id <RNVisualCloneDelegate>) delegate useCache:(BOOL)useCache
{
    
}



@end
