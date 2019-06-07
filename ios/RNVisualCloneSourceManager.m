//
//  RCTMagicMoveCloneDataManager.m
//  react-native-visual-clone
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneSourceManager.h"

@implementation RNVisualCloneSourceManager
{
  NSMutableDictionary* _items;
}

- (instancetype)init
{
  _items = [[NSMutableDictionary alloc]init];
  return self;
}

- (RNVisualCloneSource*) acquire:(NSNumber*) reactTag view:(UIView*)view
{
  @synchronized(_items)
  {
    RNVisualCloneSource* source = [_items objectForKey:reactTag];
    if ((source != nil) && (source.view == view)) {
      source.refCount = source.refCount + 1;
      return source;
    }
    source = [[RNVisualCloneSource alloc]init:reactTag view:view];
    [_items setObject:source forKey:reactTag];
    return source;
  }
}

- (long) release:(RNVisualCloneSource*) source
{
  @synchronized(_items)
  {
    source.refCount = source.refCount - 1;
    if (source.refCount == 0) {
      RNVisualCloneSource* dictItem = [_items objectForKey:source.reactTag];
      if (dictItem == source) {
        [_items removeObjectForKey:source.reactTag];
      }
    }
    return source.refCount;
  }
}

@end
