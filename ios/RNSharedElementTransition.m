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

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@interface RNSharedElementItem : NSObject
@property (nonatomic, readonly) RNSharedElementSource* source;
@property (nonatomic, assign) BOOL needsLayout;
@property (nonatomic, assign) BOOL needsContent;
@property (nonatomic, assign) id content;
@property (nonatomic, assign) RNSharedElementContentType contentType;
@property (nonatomic, assign) RNSharedElementStyle* style;
@property (nonatomic, assign) BOOL hidden;
- (instancetype)initWithSource:(RNSharedElementSource*)source;
@end

@implementation RNSharedElementItem
- (instancetype)initWithSource:(RNSharedElementSource*)source
{
    _source = source;
    _needsContent = YES;
    _needsLayout = YES;
    _content = nil;
    _contentType = RNSharedElementContentTypeImage;
    _style = nil;
    _hidden = NO;
    return self;
}
@end

@implementation RNSharedElementTransition
{
    RNSharedElementSourceManager* _sourceManager;
    NSArray* _items;
    UIImageView* _primaryImageView;
    UIImageView* _secondaryImageView;
    BOOL _reactFrameSet;
}

- (instancetype)initWithSourceManager:(RNSharedElementSourceManager*)sourceManager
{
    if ((self = [super init])) {
        _sourceManager = sourceManager;
        _sources = @[];
        _items = @[];
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
        [item.source cancelRequests:self];
    }
}

- (void)dealloc
{
    for (RNSharedElementItem* item in _items) {
        if (item.hidden) item.source.hideRefCount--;
        [_sourceManager release:item.source];
    }
    _items = @[];
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

- (RNSharedElementItem*) findItemForSource:(RNSharedElementSource*) source
{
    for (RNSharedElementItem* item in _items) {
        if (item.source == source) {
            return item;
        }
    }
    return nil;
}

- (void)setSources:(NSArray*)sources
{
    NSMutableArray* newItems = [[NSMutableArray alloc]initWithCapacity:sources.count];
    for (id source in sources) {
        RNSharedElementItem* item = [self findItemForSource:source];
        if (item == nil) {
            item = [[RNSharedElementItem alloc]initWithSource:source];
        }
        [newItems addObject:item];
    }
    
    for (RNSharedElementItem* item in _items) {
        if (![newItems containsObject:item]) {
            if (item.hidden) item.source.hideRefCount--;
        }
        [_sourceManager release:item.source];
    }
    
    _items = newItems;
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

- (void)updateSourceVisibility
{
    for (RNSharedElementItem* item in _items) {
        BOOL hidden = _autoHide && _reactFrameSet && item.style != nil && item.content != nil;
        if (item.hidden != hidden) {
            item.hidden = hidden;
            if (hidden) {
                item.source.hideRefCount++;
            } else {
                item.source.hideRefCount--;
            }
        }
    }
}

- (void)setAutoHide:(BOOL)autoHide
{
    if (_autoHide != autoHide) {
        _autoHide = autoHide;
        [self updateSourceVisibility];
    }
}

- (void) didSetProps:(NSArray<NSString *> *)changedProps
{
    for (RNSharedElementItem* item in _items) {
        if (item.needsLayout) {
            item.needsLayout = NO;
            [item.source requestStyle:self useCache:YES];
        }
        if (item.needsContent) {
            item.needsContent = NO;
            [item.source requestContent:self useCache:YES];
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

- (void) didLoadContent:(id)content contentType:(RNSharedElementContentType)contentType source:(RNSharedElementSource*)source
{
    // NSLog(@"didLoadContent: %@", content);
    RNSharedElementItem* item = [self findItemForSource:source];
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
    [self updateSourceVisibility];
}

- (void) didLoadStyle:(RNSharedElementStyle *)style source:(RNSharedElementSource*)source
{
    // NSLog(@"didMeasureLayout: %@, styleProps: %@", NSStringFromCGRect(layout), styleProps);
    RNSharedElementItem* item = [self findItemForSource:source];
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
    //long index = MAX(MIN(floor(position), _items.count - 1), 0);
    RNSharedElementItem* item1 = _items.count ? _items[0] : nil;
    RNSharedElementItem* item2 = (_items.count >= 2) ? _items[1] : nil;
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
    // NSLog(@"reactSetFrame: %@", NSStringFromCGRect(frame));
    _reactFrameSet = YES;
    [self updateStyle];
    [self updateSourceVisibility];
}

@end
