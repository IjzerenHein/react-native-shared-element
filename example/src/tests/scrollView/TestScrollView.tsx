import { useCallback, useMemo } from "react";
import { StyleSheet, View, FlatList, Image, Dimensions } from "react-native";

import { Heroes } from "../../assets";
import { Colors, SharedElement } from "../../components";
import { Hero, Size } from "../../types";

const SIZES = {
  max: Dimensions.get("window").width,
  small: 120,
  regular: 200,
  large: 280,
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").width,
    backgroundColor: Colors.back,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: "dashed",
  },
});

type Props = {
  horizontal: boolean;
  inverted: boolean;
  size: Size;
  round?: boolean;
  ImageComponent: any;
  heroes: Hero[];
  navigation?: any;
};

const heroes2 = [...Heroes];
heroes2[0] = Heroes[1];
heroes2[1] = Heroes[0];

export function TestScrollView({
  heroes = heroes2,
  size = "default",
  horizontal = false,
  inverted = false,
  ImageComponent = Image,
  round,
  navigation,
}: Props) {
  const sizePx = SIZES[size === "default" ? "regular" : size];
  const isMax = size === "max";

  const keyExtractor = useCallback((item: any) => item.id, []);

  const sizeStyle = useMemo(
    () => ({
      width: horizontal ? sizePx / (isMax ? 3.5 : 1.5) : sizePx,
      height: horizontal ? sizePx : sizePx / (isMax ? 3.5 : 1.5),
    }),
    []
  );
  const renderItem = useCallback(
    ({ item, index }: any) => {
      const hero = item;
      const content = (
        <ImageComponent
          style={[
            sizeStyle,
            round
              ? {
                  borderRadius: sizePx / 2,
                }
              : undefined,
          ]}
          source={hero.photo}
          resizeMode="cover"
        />
      );

      if (index === 1) {
        return (
          <SharedElement
            id="testContent"
            style={sizeStyle}
            navigation={navigation}
          >
            {content}
          </SharedElement>
        );
      } else {
        return content;
      }
    },
    [sizeStyle, round, sizePx, navigation]
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          width: sizePx,
          height: sizePx,
        }}
      >
        <FlatList
          style={!isMax ? styles.scrollView : undefined}
          horizontal={horizontal}
          inverted={inverted}
          data={heroes}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
}
