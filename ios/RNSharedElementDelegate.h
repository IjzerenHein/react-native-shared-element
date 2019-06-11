//
//  RNSharedElementDelegate.h
//  react-native-shared-element-transition
//

#ifndef RNSharedElementDelegate_h
#define RNSharedElementDelegate_h

#import "RNSharedElementStyle.h"
#import "RNSharedElementContentType.h"

@protocol RNSharedElementDelegate
- (void) didLoadStyle:(RNSharedElementStyle*)style source:(id)source;
- (void) didLoadContent:(id)content contentType:(RNSharedElementContentType)contentType source:(id)source;
@end

#endif
