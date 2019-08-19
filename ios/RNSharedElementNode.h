//
//  RNSharedElementNode.h
//  react-native-shared-element
//

#ifndef RNSharedElementNode_h
#define RNSharedElementNode_h

#import "RNSharedElementDelegate.h"

@interface RNSharedElementNode : NSObject

@property (nonatomic, readonly) NSNumber* reactTag;
@property (nonatomic, readonly) BOOL isParent;
@property (nonatomic) long refCount;
@property (nonatomic) long hideRefCount;

- (instancetype)init:(NSNumber *)reactTag view:(UIView*) view isParent:(BOOL)isParent;

- (void) requestContent:(id <RNSharedElementDelegate>) delegate useCache:(BOOL)useCache;
- (void) requestStyle:(id <RNSharedElementDelegate>) delegate useCache:(BOOL)useCache;
- (void) cancelRequests:(id <RNSharedElementDelegate>) delegate;

+ (void) setImageResolvers:(NSArray*) imageResolvers;

@end

#endif
