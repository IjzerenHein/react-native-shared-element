import { useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, ViewStyle } from "react-native";

import { Colors, Shadows } from "../Colors";
import { Text } from "../Text";
import { Icon } from "../icon";
import { Router } from "../router/Router";
import { useNavBarHeight } from "./constants";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: Colors.navBar,
    paddingHorizontal: 32,
    paddingBottom: 16,
    //...Shadows.elevation1
  },
  lightContainer: {
    backgroundColor: "transparent",
  },
  backContainer: {
    position: "absolute",
    left: 10,
    bottom: 10,
  },
  icon: {
    ...Shadows.textElevation1,
  },
});

const HIT_SLOP = {
  left: 16,
  top: 16,
  right: 16,
  bottom: 16,
};

type Props = {
  style?: ViewStyle;
  title?: string;
  back?: "default" | "none" | "close";
  light?: boolean;
  onBack?: () => void;
};

export function NavBar(props: Props) {
  const { style, title, back = "default", light, onBack } = props;

  const onPressBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      Router.pop();
    }
  }, [onBack]);
  const navBarHeight = useNavBarHeight();

  let icon;
  switch (back) {
    case "default":
      icon = "chevron-left";
      break;
    case "close":
      icon = "cross";
      break;
  }

  return (
    <View
      style={[
        styles.container,
        { height: navBarHeight },
        light ? styles.lightContainer : undefined,
        style,
      ]}
    >
      <Text large light={light}>
        {title ?? ""}
      </Text>
      {icon ? (
        <TouchableOpacity
          style={styles.backContainer}
          onPress={onPressBack}
          hitSlop={HIT_SLOP}
        >
          <Icon
            style={light ? styles.icon : undefined}
            name={icon}
            size={28}
            color={light ? Colors.back : Colors.text}
          />
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}
