import { Test, TestGroup } from "../types";
import { CompoundTests } from "./compound";
import { ImageTests } from "./image";
import { MultipleTests } from "./multiple";
import { ResizeAlignTests } from "./resizeAlign";
import { ScrollViewTests } from "./scrollView";
import { TextTests } from "./text";
import { TransformTests } from "./transform";
import { ViewTests } from "./view";

export const Tests: (Test | TestGroup)[] = [
  ImageTests,
  TextTests,
  ViewTests,
  CompoundTests,
  MultipleTests,
  ScrollViewTests,
  ResizeAlignTests,
  TransformTests,
];
