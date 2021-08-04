import * as React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  SharedElement,
  SharedElementTransition,
  nodeFromRef,
} from "react-native-shared-element";

export default class App extends React.Component {
  state = {
    progress: new Animated.Value(0),
    isScene2Visible: false,
    isInProgress: false,
    scene1Ancestor: null,
    scene1Node: null,
    scene2Ancestor: null,
    scene2Node: null,
  };

  onPressNavigate = () => {
    this.setState({ isScene2Visible: true, isInProgress: true });
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => this.setState({ isInProgress: false }));
  };

  onPressBack = () => {
    this.setState({ isInProgress: true });
    Animated.timing(this.state.progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() =>
      this.setState({ isScene2Visible: false, isInProgress: false })
    );
  };

  onSetScene1Ref = (ref: View | null) => {
    this.setState({ scene1Ancestor: nodeFromRef(ref) });
  };

  onSetScene2Ref = (ref: View | null) => {
    this.setState({ scene2Ancestor: nodeFromRef(ref) });
  };

  render() {
    const { state } = this;
    const { width } = Dimensions.get("window");
    return (
      <>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.5}
          onPress={
            state.isScene2Visible ? this.onPressBack : this.onPressNavigate
          }
        >
          {/* Scene 1 */}
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              transform: [
                { translateX: Animated.multiply(-200, state.progress) },
              ],
            }}
          >
            <View style={styles.scene} ref={this.onSetScene1Ref}>
              <SharedElement
                onNode={(node) => this.setState({ scene1Node: node })}
              >
                <Image style={styles.image1} source={require("./logo.png")} />
              </SharedElement>
            </View>
          </Animated.View>

          {/* Scene 2 */}
          {state.isScene2Visible ? (
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                transform: [
                  {
                    translateX: Animated.multiply(
                      -width,
                      Animated.add(state.progress, -1)
                    ),
                  },
                ],
              }}
            >
              <View style={styles.scene2} ref={this.onSetScene2Ref}>
                <SharedElement
                  onNode={(node) => this.setState({ scene2Node: node })}
                >
                  <Image style={styles.image2} source={require("./logo.png")} />
                </SharedElement>
              </View>
            </Animated.View>
          ) : undefined}
        </TouchableOpacity>

        {/* Transition overlay */}
        {state.isInProgress ? (
          <View style={styles.sharedElementOverlay} pointerEvents="none">
            <SharedElementTransition
              start={{
                node: state.scene1Node,
                ancestor: state.scene1Ancestor,
              }}
              end={{
                node: state.scene2Node,
                ancestor: state.scene2Ancestor,
              }}
              position={state.progress}
              animation="move"
              resize="auto"
              align="auto"
            />
          </View>
        ) : undefined}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  scene2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00d8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  image1: {
    resizeMode: "cover",
    width: 160,
    height: 160,
    // Images & border-radius have quirks in Expo SDK 35/36
    // Uncomment the next line when SDK 37 has been released
    //borderRadius: 80
  },
  image2: {
    resizeMode: "cover",
    width: 300,
    height: 300,
    borderRadius: 0,
  },
  sharedElementOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
