// @flow
import * as React from "react";
import { ImageBackground } from "react-native";
import { Heroes } from "../assets";
import type { Test, TestGroup } from "../types";
import { TestImage } from "./TestImage";
import { TestScrollView } from "./TestScrollView";
import FastImage from "react-native-fast-image";
import ImageZoom from "react-native-image-pan-zoom";
import PhotoView from "react-native-photo-view";

export const Tests: (Test | TestGroup)[] = [
  {
    name: "Basic Image Transitions",
    tests: [
      {
        name: "Simple Move",
        description:
          "The most basic form of a shared-element transition. The image should move smoothly without flickering from the start- to the end state, and back",
        start: <TestImage />,
        end: <TestImage end />
      },
      {
        name: "Move & Scale",
        description:
          "Another basic form of a shared-element transition. The image should move & scale correctly without flickering from the start- to the end state, and back",
        start: <TestImage size="small" />,
        end: <TestImage end size="large" />
      },
      {
        name: "Up up upscaling",
        description:
          "When images are small they are stored with a lower resolution to optimize memory usage. When transitioning to a larger image, the higher resolution image should be used and you should not see a low-res/blurred image.",
        start: <TestImage size="small" />,
        end: <TestImage end size="max" />
      }
    ]
  },
  {
    name: "Image Dissolve",
    description: `When two images are distinctly different, the "dissolve" animation creates a cross fade between the images.`,
    start: <TestImage size="regular" />,
    end: <TestImage end size="regular" hero={Heroes[2]} />,
    animation: "dissolve"
  },
  {
    name: "Image Border-radius",
    description: `It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.`,
    start: <TestImage size="regular" round />,
    end: <TestImage end size="regular" resizeMode="contain" />
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
          "TODO - This one works but test has not been implemented yet",
        start: <TestImage size="regular" resizeMode="cover" />,
        end: <TestImage end size="large" resizeMode="contain" />
      }
    ]
  },
  {
    name: "ScrollViews & Clipping",
    description:
      "When a part of the content is initially clipped, the transition should not show the whole content instantly, but reveal it gradually to make for a smooth transition",
    tests: [
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
  }
];
