// @flow
import * as React from "react";
import { ImageBackground } from "react-native";
import { Heroes } from "../assets";
import type { Test, TestGroup } from "../types";
import { TestImage } from "./TestImage";
import { TestView } from "./TestView";
import { TestScrollView } from "./TestScrollView";
import { TestCompoundView } from './TestCompoundView';
import FastImage from "react-native-fast-image";
import PhotoView from "react-native-photo-view";
import { Colors, Shadows } from "../components";

export const Tests: (Test | TestGroup)[] = [
  {
    name: "Images",
    tests: [
      {
        name: "Image Move & Scale",
        tests: [
          {
            name: "Simple move",
            description:
              "The most basic form of a shared-element transition. The image should move smoothly without flickering from the start- to the end state, and back",
            start: <TestImage />,
            end: <TestImage end />
          },
          {
            name: "Move & scale",
            description:
              "Another basic form of a shared-element transition. The image should move & scale correctly without flickering from the start- to the end state, and back",
            start: <TestImage size="small" />,
            end: <TestImage end size="large" />
          },
          {
            name: "Full size",
            description:
              "When images are small they are stored with a lower resolution to optimize memory usage. When transitioning to a larger image, the higher resolution image should be used and you should not see a low-res/blurred image.",
            start: <TestImage size="small" />,
            end: <TestImage end size="max" />
          }
        ]
      },
      {
        name: "Image Resize-modes",
        tests: [
          {
            name: "Cover  ➔  Contain",
            description:
              "Images may have different resize-mode props. The image should correctly transition from one resize mode to another",
            start: <TestImage size="small" resizeMode="cover" />,
            end: <TestImage end size="large" resizeMode="contain" />
          },
          {
            name: "Cover  ➔  Stretch",
            description:
              "Images may have different resize-mode props. The image should correctly transition from one resize mode to another",
            start: <TestImage size="small" resizeMode="cover" />,
            end: <TestImage end size="large" resizeMode="stretch" />
          },
          {
            name: "Cover  ➔  Center",
            description:
              "Images may have different resize-mode props. The image should correctly transition from one resize mode to another",
            start: <TestImage size="small" resizeMode="cover" />,
            end: <TestImage end size="large" resizeMode="center" />
          },
          {
            name: "Contain  ➔  Stretch",
            description:
              "Images may have different resize-mode props. The image should correctly transition from one resize mode to another",
            start: <TestImage size="regular" resizeMode="contain" />,
            end: <TestImage end size="regular" resizeMode="stretch" />
          },
          {
            name: "Contain  ➔  Center",
            description:
              "Images may have different resize-mode props. The image should correctly transition from one resize mode to another",
            start: <TestImage size="regular" resizeMode="contain" />,
            end: <TestImage end size="large" resizeMode="center" />
          },
          {
            name: "Stretch  ➔  Center",
            description:
              "Images may have different resize-mode props. The image should correctly transition from one resize mode to another",
            start: <TestImage size="regular" resizeMode="stretch" />,
            end: <TestImage end size="large" resizeMode="center" />
          }
        ]
      },
      {
        name: "Image Styles",
        tests: [
          {
            name: "Image Opacity",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestImage size="regular" round style={{opacity: 0.5}} />,
            end: <TestImage end size="regular" round />
          },
          {
            name: "Image Border-radius",
            description: `It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.`,
            start: <TestImage size="regular" round />,
            end: <TestImage end size="regular" resizeMode="contain" />
          },
          {
            name: "Image Border  ➔  No-border",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestImage size="regular" round style={{borderWidth: 5, borderColor: Colors.blue}} />,
            end: <TestImage end size="regular" round />
          },
          {
            name: "Image Border  ➔  Other border",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestImage size="regular" round style={{borderWidth: 5, borderColor: Colors.blue}} />,
            end: <TestImage end size="regular" round style={{borderWidth: 2, borderColor: Colors.yellow}} />
          },
          {
            name: "Image Shadow   ➔  No shadow",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestImage size="regular" round style={{...Shadows.elevation2, backgroundColor: 'white'}} />,
            end: <TestImage end size="regular" round />
          },
        ]
      },
      {
        name: "Image Dissolve",
        description: `When two images are distinctly different, the "dissolve" animation should create a smooth cross fade between the content`,
        tests: [
          {
            name: "Dissolve",
            start: <TestImage size="regular" resizeMode='cover' />,
            end: <TestImage end size="large" hero={Heroes[2]}/>,
            animation: "dissolve"
          },
          {
            name: "Dissolve != aspect-ratios",
            start: <TestImage size="regular" resizeMode='contain' />,
            end: <TestImage end size="large" hero={Heroes[8]} resizeMode='cover' />,
            animation: "dissolve"
          },
        ]
      },
      {
        name: "Image Components",
        tests: [
          {
            name: "ImageBackground",
            description:
              "ImageBackground wraps Image in a View so that children can be added to a sibling view. The wrapped Image should be correctly detected and you should not be any stretching",
            start: <TestImage size="regular" resizeMode="cover" />,
            end: (
              <TestImage
                end
                size="large"
                resizeMode="contain"
                ImageComponent={ImageBackground}
              />
            )
          },
          {
            name: "FastImage",
            description:
              "FastImage is a popular <Image> alternative that offers caching benefits. The underlying image should be correctly detected and you should not see any stretching",
            start: <TestImage size="regular" resizeMode="cover" />,
            end: (
              <TestImage
                end
                size="large"
                resizeMode="contain"
                ImageComponent={FastImage}
              />
            )
          },
          {
            name: "react-native-photo-view",
            description: "TODO - This one doesnt work yet",
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
            )
          },
          {
            name: "react-native-image-pan-zoom",
            description:
              "react-native-image-pan-zoom offers zoom & panning abilities for Images. The underlying image should be correctly detected and you should not see any stretching",
            start: <TestImage size="small" resizeMode="cover" panZoom/>,
            end: <TestImage end size="max" resizeMode="contain" panZoom />
          }
        ]
      },
    ]
  },
  {
    name: "Views",
    tests: [
      {
        name: "View Move & Scale",
        tests: [
          {
            name: "Simple move",
            description:
              "The most basic form of a shared-element transition. The view should move smoothly without flickering from the start- to the end state, and back",
            start: <TestView />,
            end: <TestView end />
          },
          {
            name: "Move & scale",
            description:
              "Another basic form of a shared-element transition. The view should move & scale correctly without flickering from the start- to the end state, and back",
            start: <TestView size="small" />,
            end: <TestView end size="large" />
          },
          {
            name: "Full size",
            description: "TODO",
            start: <TestView size="small" />,
            end: <TestView end size="max" />
          }
        ]
      },
      {
        name: "View Styles",
        tests: [
          {
            name: "View Opacity",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestView size="regular" round style={{opacity: 0.5}} />,
            end: <TestView end size="regular" round />
          },
          {
            name: "View Border-radius",
            description: `The border-radius should correctly animate for the transition.`,
            start: <TestView size="regular" round />,
            end: <TestView end size="regular" />
          },
          {
            name: "View Border  ➔  No-border",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestView size="regular" round style={{borderWidth: 5, borderColor: Colors.yellow}} />,
            end: <TestView end size="regular" round />
          },
          {
            name: "View Border  ➔  Other border",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestView size="regular" round style={{borderWidth: 5, borderColor: Colors.yellow}} />,
            end: <TestView end size="regular" round style={{borderWidth: 2, borderColor: Colors.black}} />
          },
          {
            name: "View Shadow   ➔  No shadow",
            description: `The transition should use the start- and ending opacity of the image and create a smooth transition.`,
            start: <TestView size="regular" round style={{...Shadows.elevation2, backgroundColor: 'white'}} />,
            end: <TestView end size="regular" round />
          },
        ]
      },
      {
        name: "View Dissolve",
        description: `Views with a different appearance should smoothly "dissolve" into one another`,
        tests: [
          {
            name: "Dissolve",
            start: <TestView size="regular" />,
            end: <TestView end size="regular" color={Colors.yellow} />,
            animation: "dissolve"
          },
          {
            name: "Dissolve != aspect-ratios",
            start: <TestView size="regular" />,
            end: <TestView end size="large" color={Colors.yellow} />,
            animation: "dissolve"
          },
        ]
      },
    ]
  },
  {
    name: "Compound components",
    description: 'Components with multiple children can be animated separately or as a whole',
    tests: [
      {
        name: "Simple move",
        start: <TestCompoundView position='top'/>,
        end: <TestCompoundView position='bottom'/>
      },
      {
        name: "Move & scale",
        start: <TestCompoundView position='top'/>,
        end: <TestCompoundView position='bottom' size='large'/>
      },
      {
        name: "Dissolve",
        start: <TestCompoundView size="regular" position='top' />,
        end: <TestCompoundView end size="regular" position='bottom' hero={Heroes[2]} />,
        animation: "dissolve"
      },
    ]
  },
  {
    name: "Multiple & Overlays",
    description: 'Components with multiple children can be animated separately or as a whole',
    tests: [
      {
        name: "Move multiple",
        start: <TestCompoundView position='top'/>,
        end: <TestCompoundView position='bottom' />,
        multi: true
      },
      {
        name: "Move & scale multiple",
        start: <TestCompoundView position='top'/>,
        end: <TestCompoundView position='bottom' size='large'/>,
        multi: true
      },
      {
        name: "Gradient overlay",
        start: <TestCompoundView size="regular" position='center' />,
        end: <TestCompoundView size='max' />,
        multi: true
      },
    ]
  },
  {
    name: "ScrollViews & Clipping",
    description:
      "When a part of the content is initially clipped, the transition should reveal that content gradually to make for a smooth transition",
    tests: [
      {
        name: 'ScrollView',
        start: <TestScrollView size='max' />,
        end: <TestImage end position="center" />
      },
      {
        name: 'Inverted Flatlist',
        start: <TestScrollView size='max' inverted />,
        end: <TestImage end size='max' />
      },
      {
        name: "Clip top  ➔  Slide down",
        start: <TestScrollView inverted />,
        end: <TestImage end position="bottom" />
      },
      {
        name: "Clip bottom  ➔  Slide up",
        start: <TestScrollView />,
        end: <TestImage end position="top" />
      },
      {
        name: "Clip left  ➔  Slide right",
        start: <TestScrollView horizontal inverted />,
        end: <TestImage end position="right" />
      },
      {
        name: "Clip right  ➔  Slide left",
        start: <TestScrollView horizontal />,
        end: <TestImage end position="left" />
      },
      {
        name: "Clip top  ➔  Full reveal",
        start: <TestScrollView inverted />,
        end: <TestImage end size="max" />
      },
      {
        name: "Clip bottom  ➔  Full reveal",
        start: <TestScrollView />,
        end: <TestImage end size="max" />
      },
      {
        name: "Clip left  ➔  Full reveal",
        start: <TestScrollView horizontal inverted />,
        end: <TestImage end size="max" />
      },
      {
        name: "Clip right  ➔  Full reveal",
        start: <TestScrollView horizontal />,
        end: <TestImage end size="max" />
      },
      {
        name: "Clip & border-radius",
        description:
          "The clipping-mask should be correctly applied, also when a border-radius is used with the content",
        start: <TestScrollView round />,
        end: <TestImage end size="max" />
      }
    ]
  },
];
