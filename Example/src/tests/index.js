// @flow
import type {Test, TestGroup} from '../types';
import {ImageTests} from './image';
import {TextTests} from './text';
import {ViewTests} from './view';
import {CompoundTests} from './compound';
import {MultipleTests} from './multiple';
import {ScrollViewTests} from './scrollView';
import {ResizeAlignTests} from './resizeAlign';

export const Tests: Array<Test | TestGroup> = [
  ImageTests,
  TextTests,
  ViewTests,
  CompoundTests,
  MultipleTests,
  ScrollViewTests,
  ResizeAlignTests,
];
