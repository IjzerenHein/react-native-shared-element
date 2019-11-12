// @flow
import * as React from 'react';
import type {TestGroup} from '../../types';
import {TestView} from './TestView';
import {Colors, Shadows} from '../../components';

export const ViewTests: TestGroup = {
  name: 'Views',
  tests: [
    {
      name: 'View Move & Scale',
      tests: [
        {
          name: 'Simple move',
          description:
            'The most basic form of a shared-element transition. The view should move smoothly without flickering from the start- to the end state, and back',
          start: <TestView />,
          end: <TestView end />,
        },
        {
          name: 'Move & scale',
          description:
            'Another basic form of a shared-element transition. The view should move & scale correctly without flickering from the start- to the end state, and back',
          start: <TestView size="small" />,
          end: <TestView end size="large" />,
        },
        {
          name: 'Full size',
          description: 'TODO',
          start: <TestView size="small" />,
          end: <TestView end size="max" />,
        },
      ],
    },
    {
      name: 'View Styles',
      tests: [
        {
          name: 'View Opacity',
          description:
            'The transition should use the start- and ending opacity of the image and create a smooth transition.',
          start: <TestView size="regular" round style={{opacity: 0.5}} />,
          end: <TestView end size="regular" round />,
        },
        {
          name: 'View Border-radius',
          description:
            'The border-radius should correctly animate for the transition.',
          start: <TestView size="regular" round />,
          end: <TestView end size="regular" />,
        },
        {
          name: 'View Border  ➔  No-border',
          description:
            'The transition should use the start- and ending opacity of the image and create a smooth transition.',
          start: (
            <TestView
              size="regular"
              round
              style={{borderWidth: 5, borderColor: Colors.yellow}}
            />
          ),
          end: <TestView end size="regular" round />,
        },
        {
          name: 'View Border  ➔  Other border',
          description:
            'The transition should use the start- and ending opacity of the image and create a smooth transition.',
          start: (
            <TestView
              size="regular"
              round
              style={{borderWidth: 5, borderColor: Colors.yellow}}
            />
          ),
          end: (
            <TestView
              end
              size="regular"
              round
              style={{borderWidth: 2, borderColor: Colors.black}}
            />
          ),
        },
        {
          name: 'View Shadow   ➔  No shadow',
          description:
            'The transition should use the start- and ending opacity of the image and create a smooth transition.',
          start: (
            <TestView
              size="regular"
              round
              style={{...Shadows.elevation2, backgroundColor: 'white'}}
            />
          ),
          end: <TestView end size="regular" round />,
        },
      ],
    },
    {
      name: 'View Fade',
      description:
        'Views with a different appearance should smoothly "fade" into one another',
      tests: [
        {
          name: 'Fade',
          start: <TestView size="regular" />,
          end: <TestView end size="regular" color={Colors.yellow} />,
          animation: 'fade',
        },
        {
          name: 'Fade & border-radius',
          start: <TestView size="regular" />,
          end: <TestView end size="large" round color={Colors.yellow} />,
          animation: 'fade',
        },
      ],
    },
  ],
};
