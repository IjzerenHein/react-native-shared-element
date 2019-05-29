#import <UIKit/UIKit.h>

@interface RNVisualCloneBlurEffectWithAmount : UIBlurEffect
@property (nonatomic, strong) NSNumber *blurAmount;

+ (instancetype)effectWithStyle:(UIBlurEffectStyle)style andBlurAmount:(NSNumber*)blurAmount;
@end
