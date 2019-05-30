//
//  RNVisualCloneSource.m
//  react-native-visual-clone
//

#import <Foundation/Foundation.h>
#import <React/UIView+React.h>
#import "RNVisualCloneSource.h"

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif


@implementation RNVisualCloneSource
{
    //RNVisualCloneData* _data;
    //UIView* _snapshot;
}

@synthesize autoHide = _autoHide;

- (instancetype)init
{
    if ((self = [super init])) {
        //_dataManager = dataManager;
        //_data = nil;
        //_contentType = RNVisualCloneContentTypeChildren;
        //_snapshot = nil;
        // self.layer.masksToBounds = YES; // overflow = 'hidden'
    }
    
    return self;
}


/*
- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    //
}*/

@end
