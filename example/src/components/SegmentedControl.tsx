import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Colors } from "./Colors";
import { Text } from "./Text";

const HEIGHT = 22;

type Props = {
  index: number;
  values: string[];
  onChangeValue: (index: number) => any;
  style?: any;
};

export function SegmentedControl(props: Props) {
  const { index, values, onChangeValue, style } = props;
  const borderRadius = HEIGHT / 2;
  return (
    <View style={[styles.container, style]}>
      {values.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: index === idx ? Colors.blue : Colors.back,
            borderColor: Colors.blue,
            borderWidth: 1,
            borderLeftWidth: idx ? 0 : 1,
            borderTopLeftRadius: idx === 0 ? borderRadius : 0,
            borderBottomLeftRadius: idx === 0 ? borderRadius : 0,
            borderTopRightRadius: idx === values.length - 1 ? borderRadius : 0,
            borderBottomRightRadius:
              idx === values.length - 1 ? borderRadius : 0,
          }}
          onPress={() => (idx !== index ? onChangeValue(idx) : undefined)}
        >
          <Text center color={index === idx ? Colors.back : Colors.blue}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
  },
});
