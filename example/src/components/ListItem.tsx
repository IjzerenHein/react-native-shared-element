import { useCallback } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import { Colors } from "./Colors";
import { Text } from "./Text";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.back,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 60,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  description: {
    marginTop: 1,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: "cover",
    marginRight: 16,
    shadowColor: "#000",
    /*shadowOffset: {
      width: 0,
      height: 11
    },*/
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    //borderWidth: 4,
    //borderColor: "orange"
  },
});

type Props = {
  label: string;
  description?: string;
  image?: any;
  data?: any;
  onPress?: (data: any) => void;
};

export function ListItem(props: Props) {
  const { label, description, onPress, data, image } = props;
  const onPressCallback = useCallback(() => onPress?.(data), [onPress, data]);
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={!onPress}
      onPress={onPressCallback}
    >
      <View style={styles.container}>
        {image ? <Image style={styles.image} source={image} /> : undefined}
        <View style={styles.content}>
          <Text large>{label}</Text>
          {description ? (
            <Text small style={styles.description}>
              {description}
            </Text>
          ) : undefined}
        </View>
      </View>
    </TouchableOpacity>
  );
}
