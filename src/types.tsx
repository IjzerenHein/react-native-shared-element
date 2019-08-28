export type SharedElementNode = {
  ref: any;
  nodeHandle: number;
  isParent: boolean;
  parentInstance: any;
};

export type SharedElementTransitionAnimation = "move" | "fade";

export type SharedElementTransitionResize =
  | "auto"
  | "stretch"
  | "clip"
  | "none";

export type SharedElementTransitionAlign =
  | "auto"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "center-top"
  | "center-center"
  | "center-bottom";

export type SharedElementNodeType =
  | "startNode"
  | "endNode"
  | "startAncestor"
  | "endAncestor";

export type SharedElementContentType =
  | "none"
  | "snapshotView"
  | "snapshotImage"
  | "image";
