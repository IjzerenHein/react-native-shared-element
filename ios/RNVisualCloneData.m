//
//  RNVisualCloneData.m
//  react-native-visual-clone
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneData.h"
#import "RNVisualCloneSource.h"

@implementation RNVisualCloneData

__weak UIView* _view = nil;
CGSize _size;
UIView* _cachedSnapshot = nil;
UIImage* _cachedImage = nil;

NSMutableArray* _imageDelegates;
BOOL _imageSnapshotRequested;
NSMutableArray* _rawImageDelegates;
BOOL _rawImageSnapshotRequested;

- (CGSize) size {
    return _size;
}

- (void) setSize:(CGSize)size
{
    if (CGSizeEqualToSize(_size, size)) return;

    // Update size & invalidate content
    _size = size;
    NSLog(@"Invalidated because Size was changed");
    [self invalidate];
}

- (UIView*) view
{
    return _view;
}

- (void) setView:(UIView*) view
{
    if (_view == view) return;
    
    // Remove old observers
    if ((_view != nil) &&[_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        [imageView removeObserver:self forKeyPath:@"image"];
    }
    
    // Observer key view properties
    if ((view != nil) &&[view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) view;
        [imageView addObserver:self forKeyPath:@"image" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
    }
    
    // Update view & invalidate content
    _view = view;
    NSLog(@"Invalidated because View was changed");
    [self invalidate];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"image"]) {
        NSLog(@"Invalidated because of Image change");
        [self invalidate];
    }
}

- (void) invalidate
{
    [self willChangeValueForKey:@"image"];
    [self willChangeValueForKey:@"snapshot"];
    _cachedImage = nil;
    _cachedSnapshot = nil;
    [self didChangeValueForKey:@"snapshot"];
    [self didChangeValueForKey:@"image"];
    
    [self updateImageSnapshot];
    [self updateRawImageSnapshot];
}

- (UIView*) snapshot
{
    if (_cachedSnapshot != nil) return _cachedSnapshot;
    if (_view == nil) return nil;
    if (!_size.width || !_size.height) return nil;
    
    /*if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        UIImage* image = imageView.image;
        if (image == nil) return nil;
    }*/
    
    UIView* snapshot = [_view snapshotViewAfterScreenUpdates:YES];
    _cachedSnapshot = snapshot;
    return snapshot;
}

- (UIImage*) image
{
    if (_cachedImage != nil) return _cachedImage;
    if (_view == nil) return nil;
    if (!_size.width || !_size.height) return nil;
    
    //NSLog(@"drawViewHierarchyInRect...");
    // Render view into image
    CGRect bounds = _view.bounds;
    if (!bounds.size.width || !bounds.size.height) {
        return nil;
    }
    
    /*if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        UIImage* image = imageView.image;
        _cachedImage = image;
        return image;
    }*/
    
    //bounds.origin.x = 0;
    //bounds.origin.y = 0;
    
    NSLog(@"drawViewHierarchyInRect: bounds: %@", NSStringFromCGRect(bounds));
    UIGraphicsBeginImageContextWithOptions(bounds.size, _view.opaque, 0.0f);
    BOOL res = [_view drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
    UIImage* image = res ? UIGraphicsGetImageFromCurrentImageContext() : nil;
    UIGraphicsEndImageContext();
    NSLog(@"drawViewHierarchyInRect: RESULT: %ld", res);
    
    // Update cache
    _cachedImage = image;
    return image;
}

- (void) updateImageSnapshot
{
    if (!_imageSnapshotRequested) return;
    if (_view == nil) return;
    if (!_size.width || !_size.height) return;
    
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
    
    _imageSnapshotRequested = NO;
    NSArray* delegates = _imageDelegates;
    _imageDelegates = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate imageSnapshotComplete:image];
        }
    }
}

- (void) updateRawImageSnapshot
{
    if (!_rawImageSnapshotRequested) return;
    if (_view == nil) return;
    if (!_size.width || !_size.height) return;
    
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
    
    _rawImageSnapshotRequested = NO;
    NSArray* delegates = _rawImageDelegates;
    _rawImageDelegates = nil;
    for (__weak id <RNVisualCloneDelegate> delegate in delegates) {
        if (delegate != nil) {
            [delegate rawImageSnapshotComplete:image];
        }
    }
}


- (void) requestImageSnapshot:(__weak id <RNVisualCloneDelegate>) delegate
{
    if (_imageDelegates == nil) _imageDelegates = [[NSMutableArray alloc]init];
    [_imageDelegates addObject:delegate];
    
    if (_imageDelegates.count == 1) {
        _imageSnapshotRequested = YES;
        [self updateImageSnapshot];
    }
}

- (void) requestRawImageSnapshot:(__weak id <RNVisualCloneDelegate>) delegate
{
    if (_rawImageDelegates == nil) _rawImageDelegates = [[NSMutableArray alloc]init];
    [_rawImageDelegates addObject:delegate];
    
    if (_rawImageDelegates.count == 1) {
        _rawImageSnapshotRequested = YES;
        [self updateRawImageSnapshot];
    }
}

- (void) requestViewSnapshot:(__weak id <RNVisualCloneDelegate>) delegate;
{
    
}



@end
