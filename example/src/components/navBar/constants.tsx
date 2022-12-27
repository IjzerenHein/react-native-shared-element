import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useStatusBarHeight() {
  return Math.max(useSafeAreaInsets().top, 12);
}

export const NAVBAR_HEIGHT = 44;

export function useNavBarHeight() {
  return useStatusBarHeight() + NAVBAR_HEIGHT;
}
