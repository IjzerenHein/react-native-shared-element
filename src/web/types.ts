export type RNSharedElementNodeConfig = {
  nodeHandle: HTMLElement;
  isParent: boolean;
  nodeStyle: any;
};

export enum RNSharedElementAnimation {
  Move = 0,
  Fade = 1,
  FadeIn = 2,
  FadeOut = 3
}

export enum RNSharedElementResize {
  Auto = 0,
  Stretch = 1,
  Clip = 2,
  None = 3
}

export enum RNSharedElementAlign {
  Auto = 0,
  LeftTop = 1,
  LeftCenter = 2,
  LeftBottom = 3,
  RightTop = 4,
  RightCenter = 5,
  RightBottom = 6,
  CenterTop = 7,
  CenterCenter = 8,
  CenterBottom = 9
}
