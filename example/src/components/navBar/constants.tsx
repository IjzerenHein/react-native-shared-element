import { Platform } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

export const NavBarHeight =
  56 +
  Platform.select({
    android: 0,
    default: getStatusBarHeight(),
  });
