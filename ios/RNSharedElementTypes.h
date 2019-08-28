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
    RNSharedElementTransitionResizeAuto = 0,
    RNSharedElementTransitionResizeStretch = 1,
    RNSharedElementTransitionResizeClip = 2,
    RNSharedElementTransitionResizeNone = 3
};

typedef NS_ENUM(NSInteger, RNSharedElementTransitionAlign) {
    RNSharedElementTransitionAlignAuto = 0,
    RNSharedElementTransitionAlignLeftTop = 1,
    RNSharedElementTransitionAlignLeftCenter = 2,
    RNSharedElementTransitionAlignLeftBottom = 3,
    RNSharedElementTransitionAlignRightTop = 4,
    RNSharedElementTransitionAlignRightCenter = 5,
    RNSharedElementTransitionAlignRightBottom = 6,
    RNSharedElementTransitionAlignCenterTop = 7,
    RNSharedElementTransitionAlignCenterCenter = 8,
    RNSharedElementTransitionAlignCenterBottom = 9
};


#endif
