//
//  RNVisualCloneData.h
//  react-native-visual-clone
//
//  Created by Hein Rutjes on 18/01/2019.
//

#ifndef RNVisualCloneData_h
#define RNVisualCloneData_h

typedef NS_ENUM(NSInteger, MMOptions) {
  MMOptionInitial = 1,
  MMOptionScene = 2,
  MMOptionTarget = 4,
  MMOptionVisible = 8,
  MMOptionDebug = 16,
};

typedef NS_ENUM(NSInteger, MMContentType) {
  MMContentTypeChildren = 0,
  MMContentTypeSnapshot = 1,
  MMContentTypeRawImage = 2
};

@interface RNVisualCloneData : NSObject

@property (readonly, nonatomic) NSString* sharedId;
@property (readonly, nonatomic) NSString* key;
@property (readonly, nonatomic) NSNumber* reactTag;
@property (readonly, nonatomic) UIView* snapshot;
@property (readonly, nonatomic) UIImage* rawImage;
@property (readonly, nonatomic) CGRect layout;
@property (readonly, nonatomic) MMOptions options;
@property (nonatomic) long refCount;

- (instancetype)init:(NSString*)sharedId reactTag:(NSNumber *)reactTag layout:(CGRect)layout options:(MMOptions)options snapshot:(UIView*) snapshot rawImage:(UIImage*) rawImage;

+ (NSString*) keyForSharedId:(NSString*)sharedId options:(MMOptions)options;

@end


#endif /* RNVisualCloneData_h */
