// @flow
import * as React from 'react';
import type {TestGroup} from '../../types';
import {Heroes} from '../../assets';
import {TestCompoundView} from './TestCompoundView';

export const CompoundTests: TestGroup = {
  name: 'Compound components',
  description:
    'Components with multiple children can be animated separately or as a whole',
  tests: [
    {
      name: 'Simple move',
      start: <TestCompoundView position="top" />,
      end: <TestCompoundView position="bottom" />,
    },
    {
      name: 'Move & scale',
      start: <TestCompoundView position="top" />,
      end: <TestCompoundView position="bottom" size="large" />,
    },
    {
      name: 'Fade',
      start: <TestCompoundView size="regular" position="top" />,
      end: (
        <TestCompoundView
          end
          size="regular"
          position="bottom"
          hero={Heroes[2]}
        />
      ),
      animation: 'fade',
    },
    {
      name: 'Fade (resize = clip)',
      start: (
        <TestCompoundView size="regular" position="top" hero={Heroes[2]} />
      ),
      end: (
        <TestCompoundView
          end
          size="regular"
          position="bottom"
          hero={Heroes[6]}
        />
      ),
      animation: 'fade',
      resize: 'clip',
    },
    {
      name: 'Fade & change aspect-ratio',
      start: <TestCompoundView size="regular" position="top" />,
      end: <TestCompoundView end size="regular" position="bottom" vertical />,
      animation: 'fade',
    },
    {
      name: 'Fade & change aspect-ratio (clip)',
      start: <TestCompoundView size="regular" position="top" vertical />,
      end: <TestCompoundView end size="regular" position="bottom" />,
      animation: 'fade',
      resize: 'clip',
    },
  ],
};
