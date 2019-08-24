//
//  RNSharedElementTypes.h
//  react-native-shared-element
//

#ifndef RNSharedElementTypes_h
#define RNSharedElementTypes_h

typedef NS_ENUM(NSInteger, RNSharedElementContentType) {
    RNSharedElementContentTypeNone = 0,
    RNSharedElementContentTypeSnapshotView = 1,
    RNSharedElementContentTypeSnapshotImage = 2,
    RNSharedElementContentTypeRawImage = 3
};

typedef NS_ENUM(NSInteger, RNSharedElementTransitionAnimation) {
    RNSharedElementTransitionAnimationMove = 0,
    RNSharedElementTransitionAnimationFade = 1
};

typedef NS_ENUM(NSInteger, RNSharedElementTransitionResize) {
    RNSharedElementTransitionResizeStretch = 0,
    RNSharedElementTransitionResizeClip = 1,
    RNSharedElementTransitionResizeNone = 2
};

typedef NS_ENUM(NSInteger, RNSharedElementTransitionAlign) {
    RNSharedElementTransitionAlignLeftTop = 0,
    RNSharedElementTransitionAlignLeftCenter = 1,
    RNSharedElementTransitionAlignLeftBottom = 2,
    RNSharedElementTransitionAlignRightTop = 3,
    RNSharedElementTransitionAlignRightCenter = 4,
    RNSharedElementTransitionAlignRightBottom = 5,
    RNSharedElementTransitionAlignCenterTop = 6,
    RNSharedElementTransitionAlignCenterCenter = 7,
    RNSharedElementTransitionAlignCenterBottom = 8
};


#endif
