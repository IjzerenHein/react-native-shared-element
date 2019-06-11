//
//  RCTMagicMoveCloneDataManager.m
//  react-native-shared-element-transition
//

#import <UIKit/UIKit.h>
#import "RNSharedElementSourceManager.h"

@implementation RNSharedElementSourceManager
{
  NSMutableDictionary* _items;
}

- (instancetype)init
{
  _items = [[NSMutableDictionary alloc]init];
  return self;
}

- (RNSharedElementSource*) acquire:(NSNumber*) reactTag view:(UIView*)view
{
  @synchronized(_items)
  {
    RNSharedElementSource* source = [_items objectForKey:reactTag];
    if ((source != nil) && (source.view == view)) {
      source.refCount = source.refCount + 1;
      return source;
    }
    source = [[RNSharedElementSource alloc]init:reactTag view:view];
    [_items setObject:source forKey:reactTag];
    return source;
  }
}

- (long) release:(RNSharedElementSource*) source
{
  @synchronized(_items)
  {
    source.refCount = source.refCount - 1;
    if (source.refCount == 0) {
      RNSharedElementSource* dictItem = [_items objectForKey:source.reactTag];
      if (dictItem == source) {
        [_items removeObjectForKey:source.reactTag];
      }
    }
    return source.refCount;
  }
}

@end
