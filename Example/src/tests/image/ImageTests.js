// @flow
import * as React from "react";
import type { TestGroup } from "../../types";
import { Heroes } from "../../assets";
import { TestImage } from "./TestImage";
import { ImageBackground } from "react-native";
import { FastImage } from "./FastImage";
import { PhotoView } from "./PhotoView";
import { Colors, Shadows } from "../../components";

export const ImageTests: TestGroup = {
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
          description:
            "The transition should use the start- and ending opacity of the image and create a smooth transition.",
          start: <TestImage size="regular" round style={{ opacity: 0.5 }} />,
          end: <TestImage end size="regular" round />
        },
        {
          name: "Image Border-radius",
          description:
            "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
          start: <TestImage size="regular" round />,
          end: <TestImage end size="regular" />
        },
        {
          name: "Image Border-radius & contain",
          description:
            "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
          start: <TestImage size="regular" round resizeMode="contain" />,
          end: <TestImage end size="regular" />
        },
        {
          name: "Image Border-radius & size",
          description:
            "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
          start: <TestImage size="regular" round />,
          end: <TestImage end size="max" />
        },
        {
          name: "Image Border-radius & resizeMode",
          description:
            "It's a common case that the border-radius of the start- and end image are not the same. The border-radius should correctly animate for the transition.",
          start: <TestImage size="regular" round resizeMode="cover" />,
          end: <TestImage end size="regular" resizeMode="contain" />
        },
        {
          name: "Image Border  ➔  No-border",
          description:
            "The transition should use the start- and ending opacity of the image and create a smooth transition.",
          start: (
            <TestImage
              size="regular"
              round
              style={{ borderWidth: 5, borderColor: Colors.blue }}
            />
          ),
          end: <TestImage end size="regular" round />
        },
        {
          name: "Image Border  ➔  Other border",
          description:
            "The transition should use the start- and ending opacity of the image and create a smooth transition.",
          start: (
            <TestImage
              size="regular"
              round
              style={{ borderWidth: 5, borderColor: Colors.blue }}
            />
          ),
          end: (
            <TestImage
              end
              size="regular"
              round
              style={{ borderWidth: 2, borderColor: Colors.yellow }}
            />
          )
        },
        {
          name: "Image Shadow   ➔  No shadow",
          description:
            "The transition should use the start- and ending opacity of the image and create a smooth transition.",
          start: (
            <TestImage
              size="regular"
              round
              style={{ ...Shadows.elevation2, backgroundColor: "white" }}
            />
          ),
          end: <TestImage end size="regular" round />
        }
      ]
    },
    {
      name: "Image Fade",
      description:
        'When two images are distinctly different, the "fade" animation should create a smooth cross fade between the content',
      tests: [
        {
          name: "Fade",
          start: <TestImage size="regular" resizeMode="cover" />,
          end: <TestImage end size="large" hero={Heroes[2]} />,
          animation: "fade"
        },
        {
          name: "Fade != aspect-ratios",
          start: <TestImage size="regular" resizeMode="contain" />,
          end: (
            <TestImage end size="large" hero={Heroes[8]} resizeMode="cover" />
          ),
          animation: "fade"
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
          start: (
            <TestImage
              size="regular"
              resizeMode="cover"
              ImageComponent={ImageBackground}
            />
          ),
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
          start: (
            <TestImage
              size="regular"
              resizeMode="cover"
              ImageComponent={FastImage}
            />
          ),
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
          start: <TestImage size="small" resizeMode="cover" panZoom />,
          end: <TestImage end size="max" resizeMode="contain" panZoom />
        }
      ]
    }
  ]
};
