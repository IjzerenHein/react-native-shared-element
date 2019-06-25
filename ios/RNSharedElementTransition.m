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

#define ITEM_START_ANCESTOR 0
#define ITEM_END_ANCESTOR 1
#define ITEM_START 2
#define ITEM_END 3

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@interface RNSharedElementItem : NSObject
@property (nonatomic, readonly) RNSharedElementNodeManager* nodeManager;
@property (nonatomic, readonly) BOOL isAncestor;
@property (nonatomic, readonly) NSString* name;
@property (nonatomic, assign) RNSharedElementNode* node;
@property (nonatomic, assign) BOOL needsLayout;
@property (nonatomic, assign) BOOL needsContent;
@property (nonatomic, assign) BOOL hasCalledOnMeasure;
@property (nonatomic, assign) id content;
@property (nonatomic, assign) RNSharedElementContentType contentType;
@property (nonatomic, readonly) NSString* contentTypeName;
@property (nonatomic, assign) RNSharedElementStyle* style;
@property (nonatomic, readonly) CGRect contentLayout;
@property (nonatomic, assign) BOOL hidden;
- (instancetype)initWithnodeManager:(RNSharedElementNodeManager*)nodeManager name:(NSString*)name isAncestor:(BOOL)isAncestor;
@end

@implementation RNSharedElementItem
- (instancetype)initWithnodeManager:(RNSharedElementNodeManager*)nodeManager name:(NSString*)name isAncestor:(BOOL)isAncestor
{
    _nodeManager = nodeManager;
    _name = name;
    _isAncestor = isAncestor;
    _node = nil;
    _needsLayout = NO;
    _needsContent = NO;
    _content = nil;
    _contentType = RNSharedElementContentTypeNone;
    _style = nil;
    _hidden = NO;
    _hasCalledOnMeasure = NO;
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
    _contentType = RNSharedElementContentTypeNone;
    _style = nil;
    _hidden = NO;
    _hasCalledOnMeasure = NO;
}

- (void) setHidden:(BOOL)hidden
{
    if (_hidden == hidden) return;
    _hidden = hidden;
    if (hidden) {
        _node.hideRefCount++;
    } else {
        _node.hideRefCount--;
    }
}

- (NSString*) contentTypeName
{
    switch(_contentType) {
        case RNSharedElementContentTypeNone: return @"none";
        case RNSharedElementContentTypeRawImage: return @"image";
        case RNSharedElementContentTypeSnapshotView: return @"snapshotView";
        case RNSharedElementContentTypeSnapshotImage: return @"snapshotImage";
        default: return @"unknown";
    }
}

- (CGSize) contentSize
{
    if (!_content || !_style) return CGSizeZero;
    if (_contentType != RNSharedElementContentTypeRawImage) return _style.layout.size;
    CGSize size = _style.layout.size;
    return [_content isKindOfClass:[UIImage class]] ? ((UIImage*)_content).size : size;
}

- (CGRect) contentLayout
{
    if (!_content || !_style) return CGRectZero;
    if (_contentType != RNSharedElementContentTypeRawImage) return _style.layout;
    CGSize size = _style.layout.size;
    CGSize contentSize = self.contentSize;
    CGFloat contentAspectRatio = (contentSize.width / contentSize.height);
    switch (_style.contentMode) {
        case UIViewContentModeScaleToFill: // stretch
            break;
        case UIViewContentModeScaleAspectFit: // contain
            if ((size.width / size.height) < contentAspectRatio) {
                size.height = size.width / contentAspectRatio;
            } else {
                size.width = size.height * contentAspectRatio;
            }
            break;
        case UIViewContentModeScaleAspectFill: // cover
            if ((size.width / size.height) < contentAspectRatio) {
                size.width = size.height * contentAspectRatio;
            } else {
                size.height = size.width / contentAspectRatio;
            }
            break;
        case UIViewContentModeCenter: // center
            size = contentSize;
            break;
        default:
            break;
    }
    CGRect layout = _style.layout;
    layout.origin.x += (layout.size.width - size.width) / 2;
    layout.origin.y += (layout.size.height - size.height) / 2;
    layout.size = size;
    return layout;
}
@end

@implementation RNSharedElementTransition
{
    NSArray* _items;
    UIImageView* _primaryImageView;
    UIImageView* _secondaryImageView;
    BOOL _reactFrameSet;
}

- (instancetype)initWithNodeManager:(RNSharedElementNodeManager*)nodeManager
{
    if ((self = [super init])) {
        _items = @[
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager name:@"startAncestor" isAncestor:YES],
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager name:@"endAncestor" isAncestor:YES],
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager name:@"startNode" isAncestor:NO],
                   [[RNSharedElementItem alloc]initWithnodeManager:nodeManager name:@"endNode" isAncestor:NO]
                   ];
        _nodePosition = 0.0f;
        _animation = @"move";
        _reactFrameSet = NO;
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
        item.node = nil;
    }
}

- (UIImageView*) createImageView
{
    UIImageView* imageView = [[UIImageView alloc]init];
    imageView.contentMode = UIViewContentModeScaleToFill;
    imageView.userInteractionEnabled = NO;
    imageView.frame = self.bounds;
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

- (void)setNodePosition:(CGFloat)nodePosition
{
    if (_nodePosition != nodePosition) {
        _nodePosition = nodePosition;
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
        item.hidden = _autoHide && _reactFrameSet && item.style != nil && item.content != nil;
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
    [self updateNodeVisibility];
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
    if ((contentType == RNSharedElementContentTypeSnapshotImage) || (contentType == RNSharedElementContentTypeRawImage)) {
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
    else if (contentType == RNSharedElementContentTypeSnapshotView) {
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
    [self updateNodeVisibility];
}

- (CGRect)normalizeLayout:(CGRect)layout ancestor:(RNSharedElementItem*)ancestor
{
    RNSharedElementStyle* style = ancestor.style;
    if (style == nil) return [self.superview convertRect:layout fromView:nil];
    
    // Determine origin relative to the left-top of the ancestor
    layout.origin.x -= style.layout.origin.x;
    layout.origin.y -= style.layout.origin.y;
    
    // Undo any scaling in case the screen is scaled
    if (!CGSizeEqualToSize(style.layout.size, style.size)) {
        CGFloat scaleX = style.size.width / style.layout.size.width;
        CGFloat scaleY = style.size.height / style.layout.size.height;
        layout.origin.x *= scaleX;
        layout.origin.y *= scaleY;
        layout.size.width *= scaleX;
        layout.size.height *= scaleY;
    }
    
    return [self.superview convertRect:layout fromView:nil];
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

- (CGRect) getInterpolatedLayout:(CGRect)layout1 layout2:(CGRect)layout2 position:(CGFloat) position
{
    return CGRectMake(
                      layout1.origin.x + ((layout2.origin.x - layout1.origin.x) * position),
                      layout1.origin.y + ((layout2.origin.y - layout1.origin.y) * position),
                      layout1.size.width + ((layout2.size.width - layout1.size.width) * position),
                      layout1.size.height + ((layout2.size.height - layout1.size.height) * position)
                      );
}

- (RNSharedElementStyle*) getInterpolatedStyle:(RNSharedElementStyle*)style1 style2:(RNSharedElementStyle*)style2 position:(CGFloat) position
{
    RNSharedElementStyle* style = [[RNSharedElementStyle alloc]init];
    style.opacity = style1.opacity + ((style2.opacity - style1.opacity) * position);
    style.cornerRadius = style1.cornerRadius + ((style2.cornerRadius - style1.cornerRadius) * position);
    style.borderWidth = style1.borderWidth + ((style2.borderWidth - style1.borderWidth) * position);
    style.borderColor = [self getInterpolatedColor:style1.borderColor color2:style2.borderColor position:position];
    style.backgroundColor = [self getInterpolatedColor:style1.backgroundColor color2:style2.backgroundColor position:position];
    style.shadowOpacity = style1.shadowOpacity + ((style2.shadowOpacity - style1.shadowOpacity) * position);
    style.shadowRadius = style1.shadowRadius + ((style2.shadowRadius - style1.shadowRadius) * position);
    style.shadowOffset = CGSizeMake(
                                    style1.shadowOffset.width + ((style2.shadowOffset.width - style1.shadowOffset.width) * position),
                                    style1.shadowOffset.height + ((style2.shadowOffset.height - style1.shadowOffset.height) * position)
                                    );
    style.shadowColor = [self getInterpolatedColor:style1.shadowColor color2:style2.shadowColor position:position];
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

- (void) fireMeasureEvent:(RNSharedElementItem*) item layout:(CGRect)layout visibleLayout:(CGRect)visibleLayout contentLayout:(CGRect)contentLayout
{
    if (!self.onMeasureNode) return;
    NSDictionary* eventData = @{
                                @"node": item.name,
                                @"layout": @{
                                        @"x": @(layout.origin.x),
                                        @"y": @(layout.origin.y),
                                        @"width": @(layout.size.width),
                                        @"height": @(layout.size.height),
                                        @"visibleX": @(visibleLayout.origin.x),
                                        @"visibleY": @(visibleLayout.origin.y),
                                        @"visibleWidth": @(visibleLayout.size.width),
                                        @"visibleHeight": @(visibleLayout.size.height),
                                        @"contentX": @(contentLayout.origin.x),
                                        @"contentY": @(contentLayout.origin.y),
                                        @"contentWidth": @(contentLayout.size.width),
                                        @"contentHeight": @(contentLayout.size.height),
                                        },
                                @"content": @{
                                        @"type": item.contentTypeName,
                                        @"width": @(item.contentSize.width),
                                        @"height": @(item.contentSize.height),
                                        },
                                @"style": @{
                                        @"borderRadius": @(item.style.cornerRadius)
                                        }
                                };
    self.onMeasureNode(eventData);
}

- (void) updateStyle
{
    if (!_reactFrameSet) return;
    
    // Get start layout
    RNSharedElementItem* startItem = [_items objectAtIndex:ITEM_START];
    RNSharedElementItem* startAncestor = [_items objectAtIndex:ITEM_START_ANCESTOR];
    RNSharedElementStyle* startStyle = startItem.style;
    CGRect startLayout = startStyle ? [self normalizeLayout:startStyle.layout ancestor:startAncestor] : CGRectZero;
    CGRect startVisibleLayout = startStyle ? [self normalizeLayout:startStyle.visibleLayout ancestor:startAncestor] : CGRectZero;
    CGRect startContentLayout = startStyle ? [self normalizeLayout:startItem.contentLayout ancestor:startAncestor] : CGRectZero;
    
    // Get end layout
    RNSharedElementItem* endItem = [_items objectAtIndex:ITEM_END];
    RNSharedElementItem* endAncestor = [_items objectAtIndex:ITEM_END_ANCESTOR];
    RNSharedElementStyle* endStyle = endItem.style;
    CGRect endLayout = endStyle ? [self normalizeLayout:endStyle.layout ancestor:endAncestor] : CGRectZero;
    CGRect endVisibleLayout = endStyle ? [self normalizeLayout:endStyle.visibleLayout ancestor:endAncestor] : CGRectZero;
    CGRect endContentLayout = endStyle ? [self normalizeLayout:endItem.contentLayout ancestor:endAncestor] : CGRectZero;
    
    // Get interpolated style & layout
    RNSharedElementStyle* interpolatedStyle;
    CGRect interpolatedVisibleLayout;
    CGRect interpolatedContentLayout;
    if (!startStyle && !endStyle) return;
    if (startStyle && endStyle) {
        interpolatedStyle = [self getInterpolatedStyle:startStyle style2:endStyle position:_nodePosition];
        interpolatedVisibleLayout = [self getInterpolatedLayout:startVisibleLayout layout2:endVisibleLayout position:_nodePosition];
        interpolatedContentLayout = [self getInterpolatedLayout:startContentLayout layout2:endContentLayout position:_nodePosition];
    } else if (startStyle) {
        interpolatedStyle = startStyle;
        interpolatedVisibleLayout = startVisibleLayout;
        interpolatedContentLayout = startContentLayout;
    } else {
        interpolatedStyle = endStyle;
        interpolatedVisibleLayout = endVisibleLayout;
        interpolatedContentLayout = endContentLayout;
    }
    
    // Update frame
    [super reactSetFrame:interpolatedVisibleLayout];
    self.layer.masksToBounds = true;
    
    // Update content
    CGRect contentFrame = interpolatedContentLayout;
    contentFrame.origin.x -= interpolatedVisibleLayout.origin.x;
    contentFrame.origin.y -= interpolatedVisibleLayout.origin.y;
    _primaryImageView.frame = contentFrame;
    _secondaryImageView.frame = contentFrame;
    
    // Update specified animation styles
    if ([_animation isEqualToString:@"move"]) {
        [self applyStyle:interpolatedStyle layer:self.layer];
    } else if ([_animation isEqualToString:@"dissolve"]) {
        //style.opacity = 1.0f - MIN(MAX(_value, 0.0f), 1.0f);
        interpolatedStyle.opacity = 1.0f;
        [self applyStyle:interpolatedStyle layer:_primaryImageView.layer];
        interpolatedStyle.opacity = MIN(MAX(_nodePosition, 0.0f), 1.0f);
        [self applyStyle:interpolatedStyle layer:_secondaryImageView.layer];
    }
    
    // Fire events
    if ((startAncestor.style != nil) && !startAncestor.hasCalledOnMeasure) {
        startAncestor.hasCalledOnMeasure = YES;
        startItem.hasCalledOnMeasure = NO;
        [self fireMeasureEvent:startAncestor layout:[self.superview convertRect:startAncestor.style.layout fromView:nil] visibleLayout:[self.superview convertRect:startAncestor.style.visibleLayout fromView:nil] contentLayout:[self.superview convertRect:startAncestor.style.layout fromView:nil]];
    }
    if ((startItem.style != nil) && !startItem.hasCalledOnMeasure) {
        startItem.hasCalledOnMeasure = YES;
        [self fireMeasureEvent:startItem layout:startLayout visibleLayout:startVisibleLayout contentLayout:startContentLayout];
    }
    if ((endAncestor.style != nil) && !endAncestor.hasCalledOnMeasure) {
        endAncestor.hasCalledOnMeasure = YES;
        endItem.hasCalledOnMeasure = NO;
        [self fireMeasureEvent:endAncestor layout:[self.superview convertRect:endAncestor.style.layout fromView:nil] visibleLayout:[self.superview convertRect:endAncestor.style.visibleLayout fromView:nil] contentLayout:[self.superview convertRect:endAncestor.style.layout fromView:nil]];
    }
    if ((endItem.style != nil) && !endItem.hasCalledOnMeasure) {
        endItem.hasCalledOnMeasure = YES;
        [self fireMeasureEvent:endItem layout:endLayout visibleLayout:endVisibleLayout contentLayout:endContentLayout];
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
