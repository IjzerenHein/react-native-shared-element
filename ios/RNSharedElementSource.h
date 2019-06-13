//
//  RNSharedElementSource.h
//  react-native-shared-element-transition
//

#ifndef RNSharedElementSource_h
#define RNSharedElementSource_h

#import "RNSharedElementDelegate.h"

@interface RNSharedElementSource : NSObject

@property (nonatomic, readonly) NSNumber* reactTag;
@property (nonatomic, weak) UIView* view;
@property (nonatomic, readonly) BOOL isParent;
@property (nonatomic) long refCount;
@property (nonatomic) long hideRefCount;

- (instancetype)init:(NSNumber *)reactTag view:(UIView*) view isParent:(BOOL)isParent;

- (void) requestContent:(id <RNSharedElementDelegate>) delegate useCache:(BOOL)useCache;
- (void) requestStyle:(id <RNSharedElementDelegate>) delegate useCache:(BOOL)useCache;

@end

#endif
