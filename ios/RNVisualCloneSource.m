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
    RNVisualCloneData* _data;
}

@synthesize autoHide = _autoHide; // TODO

- (instancetype)init
{
    if ((self = [super init])) {
        _data = [[RNVisualCloneData alloc]init];
    }
    
    return self;
}

- (void)dealloc
{
    _data.view = nil;
}

- (RNVisualCloneData*) getData
{
    return _data;
}

- (void)layoutSubviews
{
    _data.view = self.subviews.count ? self.subviews[0] : nil;
    _data.size = self.frame.size;
    
    [super layoutSubviews];
}

@end
