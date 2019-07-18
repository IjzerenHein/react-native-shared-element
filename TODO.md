Open issues:
[ ] Strategy for animation-types (auto?)
[X] iOS clipping when content is entirely not visible
[ ] iOS border-radius clipping (parent clipping)
[ ] iOS Image Border-radius & contain test
[ ] iOS Compound view "fade" issue
[ ] iOS ImageBackground test sometimes fails
[ ] iOS View border tests regularly fail
[ ] iOS Compound components Fade test fails (target images are not loaded)
[X] Android backgroundImage support
[X] Android scale transform support
[ ] Android FastImage support
[ ] Android inverted scrollview clipping
[ ] Android image resizeMode mode & border-radius drawing artefact
[ ] Android elevation-shadow & clip artefact
[ ] Android clip doesn't work correctly when border-radius is used

Would be nice:
[ ] Show / hide animations
[ ] Show / hide animations on Shared Element renderer
[ ] Better image fade
[ ] Web support
[ ] Blur radius

Probably not:
[ ] react-native-photo-view





## Motivation

react-native-shared-element-transition is a *"primitive"* that runs all essential steps (measure, hide, clone, interpolate, clip, etc..) of a shared element transition natively, for the best possible results. By doing so, it solves a range of problems which are impossible or very hard to solve in just JavaScript and the react-native APIs.

One of the these problems is transitioning between images with different aspect-ratios and resize-modes. Using just the react-native API you are limited to performing scale-transforms on images, which will cause stretching arfefacts when your source and target image don't have the same aspect-ratio. Also when scaling images, some blurring will occur, which is noticable depending on the size change.

A native implementation is not limited to scaling-transforms, and can change the width and height of a view correctly (without triggering a layout-pass in Yoga). This makes perfect image- and border-radius transitions possible, as well as solve sha

-

 time critical and the steps of a shared element transitions entirely native without requiring any passes over the JavaScript bridge. This solves several common problems with shared element transitions, such as smoother transitions

It works by taking in a start- and end node, which are obtained using the `<SharedElement>` component.

## Features

- Image resizeMode transitions (e.g. `cover` -> `contain`)
- 
- View resizing 


