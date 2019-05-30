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

- (CGSize) size {
    return _size;
}

- (void) setSize:(CGSize)size
{
    if (CGSizeEqualToSize(_size, size)) return;

    // Update size & invalidate content
    _size = size;
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
    [self invalidate];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"image"]) {
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
}

- (UIView*) snapshot
{
    if (_cachedSnapshot != nil) return _cachedSnapshot;
    if (_view == nil) return nil;
    
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
    
    //NSLog(@"drawViewHierarchyInRect...");
    // Render view into image
    CGRect bounds = _view.bounds;
    if (!bounds.size.width || !bounds.size.height) {
        return nil;
    }
    
    
    if ([_view isKindOfClass:[UIImageView class]]) {
        UIImageView* imageView = (UIImageView*) _view;
        UIImage* image = imageView.image;
        //[result setObject:@(rawImage.size.width * rawImage.scale) forKey:@"imageWidth"];
        //[result setObject:@(rawImage.size.height * rawImage.scale) forKey:@"imageHeight"];
        _cachedImage = image;
        return image;
    }
    
    
    //bounds.origin.x = 0;
    //bounds.origin.y = 0;
    UIGraphicsBeginImageContextWithOptions(bounds.size, _view.opaque, 0.0f);
    [_view drawViewHierarchyInRect:bounds afterScreenUpdates:YES];
    UIImage* image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    // Update cache
    _cachedImage = image;
    return image;
}

@end
