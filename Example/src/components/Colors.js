// @flow
import {Platform} from 'react-native';

export const Colors = {
  //back: "#222222",
  //text: "#FFFFFF",
  gray: '#888888',
  navBar: '#ffe256',
  //navBar: "royalblue",
  separator: '#DDDDDD',
  empty: '#F0F0F0',
  back: '#FFFFFF',
  dark: '#222222',
  text: '#222222',
  blue: 'royalblue',
  yellow: '#ffe256',
  black: '#000000',
};

export const Shadows = {
  elevation1: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 2,
      shadowOpacity: 0.1,
    },
    android: {
      elevation: 2,
    },
  }),
  elevation2: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
    },
    android: {
      elevation: 3,
    },
  }),
  textElevation1: {
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 2,
  },
};
