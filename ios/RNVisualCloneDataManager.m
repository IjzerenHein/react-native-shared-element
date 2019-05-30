//
//  RNVisualCloneDataManager.m
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 18/01/2019.
//

#import <UIKit/UIKit.h>
#import "RNVisualCloneDataManager.h"

@implementation RNVisualCloneDataManager
{
  NSMutableDictionary* _items;
}

- (instancetype)init
{
  _items = [[NSMutableDictionary alloc]init];
  return self;
}

- (RNVisualCloneData*) acquire:(NSNumber*) sourceView
{
  @synchronized(_items)
  {
    RNVisualCloneData* item = [_items objectForKey:sourceView];
    if (item != nil) {
      item.refCount = item.refCount + 1;
    }
    return item;
  }
}

- (long) release:(RNVisualCloneData*) item
{
  @synchronized(_items)
  {
    item.refCount = item.refCount - 1;
    if (item.refCount == 0) {
      [_items removeObjectForKey:item.sourceView];
    }
    return item.refCount;
  }
}

- (void) put:(RNVisualCloneData*) item
{
  @synchronized(_items)
  {
    [_items setObject:item forKey:item.sourceView];
  }
}

@end
