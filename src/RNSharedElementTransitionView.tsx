import { requireNativeComponent, NativeModules } from 'react-native';

const isAvailable = NativeModules.RNSharedElementTransition ? true : false;

if (isAvailable) {
  NativeModules.RNSharedElementTransition.configure({
    imageResolvers: [
      'RNPhotoView.MWTapDetectingImageView', // react-native-photo-view
    ].map(path => path.split('.')),
  });
}

export const RNSharedElementTransitionView = isAvailable
  ? requireNativeComponent('RNSharedElementTransition')
  : undefined;
