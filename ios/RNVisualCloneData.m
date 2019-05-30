//
//  RNVisualCloneData.m
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 18/01/2019.
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneData.h"

@implementation RNVisualCloneData

@synthesize sourceView = _sourceView;
// @synthesize layout = _layout;
@synthesize refCount = _refCount;
UIView* _snapshot = nil;
UIImage* _image = nil;

- (instancetype)init:(NSNumber *)sourceView
{
  _sourceView = sourceView;
  _refCount = 1;
  return self;
}

- (UIView*) snapshot
{
  // TODO
  return _snapshot;
}

- (UIImage*) image
{
    // TODO
    return _image;
}

@end
