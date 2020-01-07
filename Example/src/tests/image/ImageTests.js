// @flow
import * as React from 'react';
import type {TestGroup} from '../../types';
import {Heroes} from '../../assets';
import {TestImage} from './TestImage';
import {ImageBackground, Animated} from 'react-native';
import {FastImage} from './FastImage';
import {PhotoView} from './PhotoView';
import {Colors, Shadows} from '../../components';

export function createImageTests(config: {
  title: string,
  name: string,
  props: any,
}): TestGroup {
  const {title, name, props} = config;
  const startProps = props;
  const endProps = props;
  return {
    name: title,
    tests: [
      {
        name: `${name} Move & Scale`,
        tests: [
          {
            name: 'Simple move',
            description:
              'The most basic form of a shared-element transition. The image should move smoothly without flickering from the start- to the end state, and back',
            start: <TestImage {...startProps} />,
            end: <TestImage {...endProps} end />,
          },
          {
            name: 'Move & scale',
            description:
              'Another basic form of a shared-element transition. The image should move & scale correctly without flickering from the start- to the end state, and back',
            start: <TestImage {...startProps} size="small" />,
            end: <TestImage {...endProps} end size="large" />,
          },
          {
            name: 'Full size',
            description:
              'When images are small they are stored with a lower resolution to optimize memory usage. When transitioning to a larger image, the higher resolution image should be used and you should not see a low-res/blurred image.',
            start: <TestImage {...startProps} size="small" />,
            end: <TestImage {...endProps} end size="max" />,
          },
        ],
      },
      {
        name: `${name} Resize-modes`,
        tests: [
          {
            name: 'Cover  ➔  Contain',
            description:
              'Images may have different resize-mode props. The image should correctly transition from one resize mode to another',
            start: (
              <TestImage {...startProps} size="small" resizeMode="cover" />
            ),
            end: (
              <TestImage {...endProps} end size="large" resizeMode="contain" />
            ),
          },
          {
            name: 'Cover  ➔  Stretch',
            description:
              'Images may have different resize-mode props. The image should correctly transition from one resize mode to another',
            start: (
              <TestImage {...startProps} size="small" resizeMode="cover" />
            ),
            end: (
              <TestImage {...endProps} end size="large" resizeMode="stretch" />
            ),
          },
          {
            name: 'Cover  ➔  Center',
            description:
              'Images may have different resize-mode props. The image should correctly transition from one resize mode to another',
            start: (
              <TestImage {...startProps} size="small" resizeMode="cover" />
            ),
            end: (
              <TestImage {...endProps} end size="large" resizeMode="center" />
            ),
          },
          {
            name: 'Contain  ➔  Stretch',
            description:
              'Images may have different resize-mode props. The image should correctly transition from one resize mode to another',
            start: (
              <TestImage {...startProps} size="regular" resizeMode="contain" />
            ),
            end: (
              <TestImage
                {...endProps}
                end
                size="regular"
                resizeMode="stretch"
              />
            ),
          },
          {
            name: 'Contain  ➔  Center',
            description:
              'Images may have different resize-mode props. The image should correctly transition from one resize mode to another',
            start: (
              <TestImage {...startProps} size="regular" resizeMode="contain" />
            ),
            end: (
              <TestImage {...endProps} end size="large" resizeMode="center" />
            ),
          },
          {
            name: 'Stretch  ➔  Center',
            description:
              'Images may have different resize-mode props. The image should correctly transition from one resize mode to another',
            start: (
              <TestImage {...startProps} size="regular" resizeMode="stretch" />
            ),
            end: (
              <TestImage {...endProps} end size="large" resizeMode="center" />
            ),
          },
        ],
      },
      {
        name: `${name} Styles`,
        tests: [
          {
            name: 'Opacity change',
            description:
              'The transition should use the start- and ending opacity of the image and create a smooth transition.',
            start: (
              <TestImage
                {...startProps}
                size="regular"
                round
                style={{opacity: 0.5}}
              />
            ),
            end: <TestImage {...endProps} end size="regular" round />,
          },
          {
            name: 'Border-radius change',
            description:
              "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
            start: <TestImage {...startProps} size="regular" round />,
            end: <TestImage {...endProps} end size="regular" />,
          },
          {
            name: 'Border-radius & contain',
            description:
              "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
            start: (
              <TestImage
                {...startProps}
                size="regular"
                round
                resizeMode="contain"
              />
            ),
            end: <TestImage {...endProps} end size="regular" />,
          },
          {
            name: 'Border-radius & size',
            description:
              "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
            start: <TestImage {...startProps} size="regular" round />,
            end: <TestImage {...endProps} end size="max" />,
          },
          {
            name: 'Border-radius & resizeMode',
            description:
              "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
            start: (
              <TestImage
                {...startProps}
                size="regular"
                round
                resizeMode="cover"
              />
            ),
            end: (
              <TestImage
                {...endProps}
                end
                size="regular"
                resizeMode="contain"
              />
            ),
          },
          {
            name: 'Border  ➔  No-border',
            description:
              'The transition should use the start- and ending opacity of the image and create a smooth transition.',
            start: (
              <TestImage
                {...startProps}
                size="regular"
                round
                style={{borderWidth: 5, borderColor: Colors.blue}}
              />
            ),
            end: <TestImage {...endProps} end size="regular" round />,
          },
          {
            name: 'Border  ➔  Other border',
            description:
              'The transition should use the start- and ending opacity of the image and create a smooth transition.',
            start: (
              <TestImage
                {...startProps}
                size="regular"
                round
                style={{borderWidth: 5, borderColor: Colors.blue}}
              />
            ),
            end: (
              <TestImage
                {...endProps}
                end
                size="regular"
                round
                style={{borderWidth: 2, borderColor: Colors.yellow}}
              />
            ),
          },
          {
            name: 'Shadow   ➔  No shadow',
            description:
              'The transition should use the start- and ending opacity of the image and create a smooth transition.',
            start: (
              <TestImage
                {...startProps}
                size="regular"
                round
                style={{...Shadows.elevation2, backgroundColor: 'white'}}
              />
            ),
            end: <TestImage {...endProps} end size="regular" round />,
          },
          {
            name: 'Resize-mode & Border & Radius',
            description: 'Should look good',
            start: (
              <TestImage
                {...startProps}
                size="regular"
                resizeMode="cover"
                round
                style={{
                  borderWidth: 2,
                  borderColor: 'green',
                }}
              />
            ),
            end: (
              <TestImage
                {...endProps}
                end
                size="large"
                resizeMode="contain"
                round
                style={{
                  borderWidth: 2,
                  borderColor: 'blue',
                }}
              />
            ),
          },
        ],
      },
      {
        name: `${name} Fade`,
        description:
          'When two images are distinctly different, the "fade" animation should create a smooth cross fade between the content',
        tests: [
          {
            name: 'Fade',
            start: (
              <TestImage {...startProps} size="regular" resizeMode="cover" />
            ),
            end: <TestImage {...endProps} end size="large" hero={Heroes[2]} />,
            animation: 'fade',
          },
          {
            name: 'Fade != aspect-ratios',
            start: (
              <TestImage {...startProps} size="regular" resizeMode="contain" />
            ),
            end: (
              <TestImage
                {...endProps}
                end
                size="large"
                hero={Heroes[8]}
                resizeMode="cover"
              />
            ),
            animation: 'fade',
          },
        ],
      },
    ],
  };
}

export const ImageTests = createImageTests({
  title: 'Images',
  name: 'Image',
  props: {},
});

export const ImageBackgroundTests = createImageTests({
  title: 'ImageBackground Component',
  name: 'ImageBackground',
  props: {
    ImageComponent: ImageBackground,
  },
});
ImageTests.tests.push(ImageBackgroundTests);

export const AnimatedImageTests = createImageTests({
  title: 'Animated.Image Component',
  name: 'Animated.Image',
  props: {
    ImageComponent: Animated.Image,
  },
});
ImageTests.tests.push(AnimatedImageTests);

export const FastImageTests = createImageTests({
  title: 'FastImage Component',
  name: 'FastImage',
  props: {
    ImageComponent: FastImage,
  },
});
ImageTests.tests.push(FastImageTests);

const oldTests: TestGroup = {
  name: 'Other Image Components',
  tests: [
    {
      name: 'react-native-photo-view',
      description: 'TODO - This one doesnt work yet',
      start: <TestImage size="regular" resizeMode="cover" />,
      end: (
        <TestImage
          end
          size="large"
          resizeMode="contain"
          ImageComponent={(props: any) => (
            <PhotoView
              {...props}
              minimumZoomScale={0.5}
              maximumZoomScale={3}
              androidScaleType="center"
            />
          )}
        />
      ),
    },
    {
      name: 'react-native-image-pan-zoom',
      description:
        'react-native-image-pan-zoom offers zoom & panning abilities for Images. The underlying image should be correctly detected and you should not see any stretching',
      start: <TestImage size="small" resizeMode="cover" panZoom />,
      end: <TestImage end size="max" resizeMode="contain" panZoom />,
    },
  ],
};
ImageTests.tests.push(oldTests);
