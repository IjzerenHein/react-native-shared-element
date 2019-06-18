//
//  RNSharedElementTransition.m
//  react-native-shared-element-transition
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreImage/CoreImage.h>
#import <React/RCTDefines.h>
#import <React/UIView+React.h>
#import "RNSharedElementTransition.h"

#define ITEM_START 0
#define ITEM_START_ANCESTOR 1
#define ITEM_END 2
#define ITEM_END_ANCESTOR 3

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@interface RNSharedElementItem : NSObject
@property (nonatomic, readonly) RNSharedElementNodeManager* nodeManager;
@property (nonatomic, readonly) BOOL isAncestor;
@property (nonatomic, assign) RNSharedElementNode* node;
@property (nonatomic, assign) BOOL needsLayout;
@property (nonatomic, assign) BOOL needsContent;
@property (nonatomic, assign) id content;
@property (nonatomic, assign) RNSharedElementContentType contentType;
@property (nonatomic, assign) RNSharedElementStyle* style;
@property (nonatomic, assign) BOOL hidden;
- (instancetype)initWithnodeManager:(RNSharedElementNodeManager*)nodeManager isAncestor:(BOOL)isAncestor;
@end

@implementation RNSharedElementItem
- (instancetype)initWithnodeManager:(RNSharedElementNodeManager*)nodeManager isAncestor:(BOOL)isAncestor
{
    _nodeManager = nodeManager;
    _isAncestor = isAncestor;
    _node = nil;
    _needsLayout = NO;
    _needsContent = NO;
    _content = nil;
    _contentType = RNSharedElementContentTypeImage;
    _style = nil;
    _hidden = NO;
    return self;
}
- (void) setNode:(RNSharedElementNode *)node
{
    if (_node == node) {
        if (node != nil) [_nodeManager release:node];
        return;
    }
    if (_node != nil) {
        if (_hidden) _node.hideRefCount--;
        [_nodeManager release:_node];
    }
    _node = node;
    _needsLayout = node != nil;
    _needsContent = !_isAncestor && (node != nil);
    _content = nil;
    _contentType = RNSharedElementContentTypeImage;
    _style = nil;
    _hidden = NO;
}
@end

@implementation RNSharedElementTransition
{
    NSArray* _items;
    UIImageView* _primaryImageView;
    UIImageView* _secondaryImageView;
    BOOL _reactFrameSet;
}

- (instancetype)initWithnodeManager:(RNSharedElementNodeManager*)nodeManager
{
    if ((self = [super init])) {
        _items = @[
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager isAncestor:NO],
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager isAncestor:YES],
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager isAncestor:NO],
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager isAncestor:YES]
                   ];
        _value = 0.0f;
        _animation = @"move";
        _reactFrameSet = NO;
        //self.contentMode = UIViewContentModeScaleAspectFill;
        self.userInteractionEnabled = NO;
        _primaryImageView = [self createImageView];
        [self addSubview:_primaryImageView];
        _secondaryImageView = [self createImageView];
        [self addSubview:_secondaryImageView];
    }
    
    return self;
}

- (void)removeFromSuperview
{
    [super removeFromSuperview];
    
    for (RNSharedElementItem* item in _items) {
        if (item.node != nil) [item.node cancelRequests:self];
    }
}

- (void)dealloc
{
    for (RNSharedElementItem* item in _items) {
        if (item.hidden) {
            item.node.hideRefCount--;
            item.hidden = NO;
        }
        item.node = nil;
    }
}

- (UIImageView*) createImageView
{
    UIImageView* imageView = [[UIImageView alloc]init];
    imageView.contentMode = UIViewContentModeScaleAspectFill;
    imageView.userInteractionEnabled = NO;
    imageView.frame = self.bounds;
    imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    return imageView;
}

- (RNSharedElementItem*) findItemForNode:(RNSharedElementNode*) node
{
    for (RNSharedElementItem* item in _items) {
        if (item.node == node) {
            return item;
        }
    }
    return nil;
}

- (void)setStartNode:(RNSharedElementNode *)startNode
{
    ((RNSharedElementItem*)[_items objectAtIndex:ITEM_START]).node = startNode;
}

- (void)setEndNode:(RNSharedElementNode *)endNode
{
    ((RNSharedElementItem*)[_items objectAtIndex:ITEM_END]).node = endNode;
}

- (void)setStartAncestor:(RNSharedElementNode *)startNodeAncestor
{
    ((RNSharedElementItem*)[_items objectAtIndex:ITEM_START_ANCESTOR]).node = startNodeAncestor;
}

- (void)setEndAncestor:(RNSharedElementNode *)endNodeAncestor
{
    ((RNSharedElementItem*)[_items objectAtIndex:ITEM_END_ANCESTOR]).node = endNodeAncestor;
}

- (void)setValue:(CGFloat)value
{
    if (_value != value) {
        _value = value;
        [self updateStyle];
    }
}

- (void) setAnimation:(NSString *)animation
{
    if (![_animation isEqualToString:animation]) {
        _animation = animation;
        [self updateStyle];
    }
}

- (void)updateNodeVisibility
{
    for (RNSharedElementItem* item in _items) {
        BOOL hidden = _autoHide && _reactFrameSet && item.style != nil && item.content != nil;
        if (item.hidden != hidden) {
            item.hidden = hidden;
            if (hidden) {
                item.node.hideRefCount++;
            } else {
                item.node.hideRefCount--;
            }
        }
    }
}

- (void)setAutoHide:(BOOL)autoHide
{
    if (_autoHide != autoHide) {
        _autoHide = autoHide;
        [self updateNodeVisibility];
    }
}

- (void) didSetProps:(NSArray<NSString *> *)changedProps
{
    for (RNSharedElementItem* item in _items) {
        if (_reactFrameSet && item.needsLayout) {
            item.needsLayout = NO;
            [item.node requestStyle:self useCache:YES];
        }
        if (item.needsContent) {
            item.needsContent = NO;
            [item.node requestContent:self useCache:YES];
        }
    }
}

- (void)updateViewWithImage:(UIImageView*)view image:(UIImage *)image
{
    if (!image) {
        view.image = nil;
        return;
    }
    
    // Apply trilinear filtering to smooth out mis-sized images
    self.layer.minificationFilter = kCAFilterTrilinear;
    self.layer.magnificationFilter = kCAFilterTrilinear;
    
    // NSLog(@"updateWithImage: %@", NSStringFromCGRect(self.frame));
    view.image = image;
}

- (void) didLoadContent:(id)content contentType:(RNSharedElementContentType)contentType node:(RNSharedElementNode*)node
{
    // NSLog(@"didLoadContent: %@", content);
    RNSharedElementItem* item = [self findItemForNode:node];
    if (item == nil) return;
    if ((contentType == RNSharedElementContentTypeImage) || (contentType == RNSharedElementContentTypeRawImage)) {
        UIImage* image = content;
        item.content = content;
        item.contentType = contentType;
        if ([_animation isEqualToString:@"move"]) {
            if (_primaryImageView.image == nil) {
                [self updateViewWithImage:_primaryImageView image:image];
            } else if ((image.size.width * image.size.height) > (_primaryImageView.image.size.width * _primaryImageView.image.size.height)) {
                [self updateViewWithImage:_primaryImageView image:image];
            }
        } else {
            if (item == _items[0]) {
                [self updateViewWithImage:_primaryImageView image:image];
            } else {
                [self updateViewWithImage:_secondaryImageView image:image];
            }
        }
    }
    else if (contentType == RNSharedElementContentTypeSnapshot) {
        // TODO
    }
    [self updateStyle];
    [self updateNodeVisibility];
}

- (void) didLoadStyle:(RNSharedElementStyle *)style node:(RNSharedElementNode*)node
{
    // NSLog(@"didLoadStyle: %@", NSStringFromCGRect(style.layout));
    RNSharedElementItem* item = [self findItemForNode:node];
    if (item == nil) return;
    item.style = style;
    [self updateStyle];
}

- (UIColor*) getInterpolatedColor:(UIColor*)color1 color2:(UIColor*)color2 position:(CGFloat)position
{
    CGFloat red1, green1, blue1, alpha1;
    CGFloat red2, green2, blue2, alpha2;
    [color1 getRed:&red1 green:&green1 blue:&blue1 alpha:&alpha1];
    [color2 getRed:&red2 green:&green2 blue:&blue2 alpha:&alpha2];
    return [UIColor colorWithRed:red1 + ((red2 - red1) * position)
                           green:green1 + ((green2 - green1) * position)
                            blue:blue1 + ((blue2 - blue1) * position)
                           alpha:alpha1 + ((alpha2 - alpha1) * position)];
}

- (RNSharedElementStyle*) getInterpolatedStyle:(RNSharedElementStyle*)style1 style2:(RNSharedElementStyle*)style2 position:(CGFloat) position
{
    CGRect layout1 = style1.layout;
    CGRect layout2 = style2.layout;
    CGFloat pos = MAX(MIN(position, _items.count), 0);
    
    RNSharedElementStyle* style = [[RNSharedElementStyle alloc]init];
    style.layout = CGRectMake(
                              layout1.origin.x + ((layout2.origin.x - layout1.origin.x) * pos),
                              layout1.origin.y + ((layout2.origin.y - layout1.origin.y) * pos),
                              layout1.size.width + ((layout2.size.width - layout1.size.width) * pos),
                              layout1.size.height + ((layout2.size.height - layout1.size.height) * pos)
                              );
    style.opacity = style1.opacity + ((style2.opacity - style1.opacity) * pos);
    style.cornerRadius = style1.cornerRadius + ((style2.cornerRadius - style1.cornerRadius) * pos);
    style.borderWidth = style1.borderWidth + ((style2.borderWidth - style1.borderWidth) * pos);
    style.borderColor = [self getInterpolatedColor:style1.borderColor color2:style2.borderColor position:pos];
    style.backgroundColor = [self getInterpolatedColor:style1.backgroundColor color2:style2.backgroundColor position:pos];
    style.shadowOpacity = style1.shadowOpacity + ((style2.shadowOpacity - style1.shadowOpacity) * pos);
    style.shadowRadius = style1.shadowRadius + ((style2.shadowRadius - style1.shadowRadius) * pos);
    style.shadowOffset = CGSizeMake(
                                    style1.shadowOffset.width + ((style2.shadowOffset.width - style1.shadowOffset.width) * pos),
                                    style1.shadowOffset.height + ((style2.shadowOffset.height - style1.shadowOffset.height) * pos)
                                    );
    style.shadowColor = [self getInterpolatedColor:style1.shadowColor color2:style2.shadowColor position:pos];
    
    return style;
}

- (void) applyStyle:(RNSharedElementStyle*)style layer:(CALayer*)layer
{
    layer.opacity = style.opacity;
    layer.backgroundColor = style.backgroundColor.CGColor;
    layer.cornerRadius = style.cornerRadius;
    layer.borderWidth = style.borderWidth;
    layer.borderColor = style.borderColor.CGColor;
    layer.shadowOpacity = style.shadowOpacity;
    layer.shadowRadius = style.shadowRadius;
    layer.shadowOffset = style.shadowOffset;
    layer.shadowColor = style.shadowColor.CGColor;
}

- (void) updateStyle
{
    if (!_reactFrameSet) return;
    
    // Get interpolated style
    RNSharedElementItem* item1 = [_items objectAtIndex:ITEM_START];
    RNSharedElementItem* item2 = [_items objectAtIndex:ITEM_END];
    RNSharedElementStyle* style1 = (item1 != nil) ? item1.style : nil;
    RNSharedElementStyle* style2 = (item2 != nil) ? item2.style : nil;
    if ((style1 == nil) && (style2 == nil)) return;
    if (style1 == nil) {
        style1 = style2;
    } else if (style2 == nil) {
        style2 = style1;
    }
    RNSharedElementStyle* style = [self getInterpolatedStyle:style1 style2:style2 position:_value];
    
    // Update frame
    CGRect frame = [self.superview convertRect:style.layout fromView:nil];
    [super reactSetFrame:frame];
    _primaryImageView.frame = self.bounds;
    _secondaryImageView.frame = self.bounds;
    
    // Update styles
    self.layer.cornerRadius = style.cornerRadius;
    self.layer.masksToBounds = true;
    
    // Update specified animation styles
    if ([_animation isEqualToString:@"move"]) {
        [self applyStyle:style layer:self.layer];
    } else if ([_animation isEqualToString:@"dissolve"]) {
        //style.opacity = 1.0f - MIN(MAX(_value, 0.0f), 1.0f);
        style.opacity = 1.0f;
        [self applyStyle:style layer:_primaryImageView.layer];
        style.opacity = MIN(MAX(_value, 0.0f), 1.0f);
        [self applyStyle:style layer:_secondaryImageView.layer];
    }
}

- (void) reactSetFrame:(CGRect)frame
{
    // Only after the frame bounds have been set by the RN layout-system
    // we schedule a layout-fetch to run after these updates to ensure
    // that Yoga/UIManager has finished the initial layout pass.
    if (_reactFrameSet == NO) {
        //NSLog(@"reactSetFrame: %@", NSStringFromCGRect(frame));
        _reactFrameSet = YES;
        dispatch_async(dispatch_get_main_queue(), ^{
            for (RNSharedElementItem* item in _items) {
                if (item.needsLayout) {
                    item.needsLayout = NO;
                    [item.node requestStyle:self useCache:YES];
                }
            }
        });
    }
    
    // When react attempts to change the frame on this view,
    // override that and apply our own measured frame and styles
    [self updateStyle];
    [self updateNodeVisibility];
}

@end
