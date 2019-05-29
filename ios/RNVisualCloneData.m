//
//  RNVisualCloneData.m
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 18/01/2019.
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneData.h"

@implementation RNVisualCloneData

@synthesize sharedId = _sharedId;
@synthesize reactTag = _reactTag;
@synthesize layout = _layout;
@synthesize snapshot = _snapshot;
@synthesize rawImage = _rawImage;
@synthesize options = _options;
@synthesize refCount = _refCount;

- (instancetype)init:(NSString*)sharedId reactTag:(NSNumber *)reactTag layout:(CGRect)layout options:(MMOptions)options snapshot:(UIView*) snapshot rawImage:(UIImage*) rawImage
{
  _sharedId = sharedId;
  _reactTag = reactTag;
  _layout = layout;
  _snapshot = snapshot;
  _rawImage = rawImage;
  _options = options;
  _refCount = 1;
  return self;
}

- (NSString*) key
{
  return [RNVisualCloneData keyForSharedId:_sharedId options:_options];
}

+ (NSString*) keyForSharedId:(NSString*)sharedId options:(MMOptions)options
{
  NSString* type;
  if (options & MMOptionScene) {
    type = (options & MMOptionTarget) ? @"TargetScene" : @"SourceScene";
  }
  else {
    type = (options & MMOptionTarget) ? @"TargetComponent" : @"SourceComponent";
  }
  return [NSString stringWithFormat:@"%@:%@", type, sharedId];
}

@end
