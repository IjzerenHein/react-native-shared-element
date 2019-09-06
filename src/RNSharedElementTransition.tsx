import { requireNativeComponent, NativeModules } from "react-native";

const isAvailable = NativeModules.RNSharedElementTransition ? true : false;

if (isAvailable) {
  NativeModules.RNSharedElementTransition.configure({
    imageResolvers: [
      "RNPhotoView.MWTapDetectingImageView", // react-native-photo-view
      "RCTView.FFFastImageView" // react-native-fast-image
    ].map(path => path.split("."))
  });
}

export const RNSharedElementTransition = isAvailable
  ? requireNativeComponent("RNSharedElementTransition")
  : undefined;
