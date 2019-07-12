// @flow

export type SharedElementNode = {
  ref: any,
  nodeHandle: number,
  isParent: boolean,
  parentInstance: any
};

export type SharedElementAnimation =
  | "move"
  | "fade"
  | "fade-stretch"
  | "fade-top"
  | "fade-bottom"
  | "fade-left"
  | "fade-right";

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
