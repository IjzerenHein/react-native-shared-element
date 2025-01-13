import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import { Heroes } from "../assets";
import { Router, NavBar, SharedElement, Colors, Text } from "../components";
import { fadeIn, TransitionConfig } from "../transitions";
import { SharedElementsConfig } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  flex: {
    flex: 1,
  },
  item: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  overlay: {
    borderRadius: 40,
  },
  content: {
    flex: 1,
    marginLeft: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    marginBottom: 4,
    flexDirection: "row",
  },
});

type Props = {
  title: string;
  DetailComponent: any;
  transitionConfig: TransitionConfig;
  navigation?: any;
};

export function ListScreen(props: Props) {
  const {
    title = "Bullets",
    DetailComponent,
    transitionConfig = fadeIn(),
    navigation,
  } = props;
  return (
    <View style={styles.container}>
      <NavBar title={title} />
      <ScrollView style={styles.flex}>
        {Heroes.map((hero) => {
          const { id, name, photo, quote } = hero;
          return (
            <TouchableOpacity
              key={`Hero${id}`}
              style={styles.item}
              activeOpacity={1}
              onPress={() => {
                const sharedElements: SharedElementsConfig = [
                  `heroPhoto.${hero.id}`,
                  { id: `heroPhotoOverlay.${hero.id}`, animation: "fade" },
                  `heroName.${hero.id}`,
                ];
                Router.push(<DetailComponent hero={hero} />, {
                  sharedElements,
                  transitionConfig,
                });
              }}
            >
              <View style={styles.image}>
                <SharedElement id={`heroPhoto.${id}`} navigation={navigation}>
                  <Image
                    style={styles.image}
                    source={photo}
                    resizeMode="cover"
                  />
                </SharedElement>
                <SharedElement
                  id={`heroPhotoOverlay.${id}`}
                  style={StyleSheet.absoluteFill}
                  navigation={navigation}
                >
                  <View
                    style={[StyleSheet.absoluteFill, styles.overlay]}
                    collapsable={false}
                  />
                </SharedElement>
              </View>
              <View style={styles.content}>
                <View style={styles.name}>
                  <SharedElement id={`heroName.${id}`} navigation={navigation}>
                    <Text xlarge>{name}</Text>
                  </SharedElement>
                </View>
                <Text small>{quote ?? ""}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
