import { useState, useCallback } from "react";
import { StyleSheet, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

import { useNavBarHeight } from "../navBar/constants";

type Props = {
  width: number;
  animValue: Animated.Value;
  prevIndex: number;
  nextIndex: number;
  onBackSwipe: (nextIndex: number, finish?: boolean) => void;
};

export function RouterBackSwiper(props: Props) {
  const { nextIndex, prevIndex, width, animValue, onBackSwipe } = props;

  const navBarHeight = useNavBarHeight();

  const [onGestureEvent] = useState(() =>
    Animated.event([{ nativeEvent: { translationX: animValue } }], {
      useNativeDriver: true,
    })
  );

  const onStateChange = useCallback(
    (event: any) => {
      const { nativeEvent } = event;
      switch (nativeEvent.state) {
        case State.ACTIVE:
          // console.log("SWIPE ACTIVE: ", nativeEvent);
          onBackSwipe(Math.max(nextIndex - 1, 0));
          break;
        case State.CANCELLED:
          // console.log("SWIPE CANCEL: ", nativeEvent);
          onBackSwipe(prevIndex);
          break;
        case State.END:
          // console.log("SWIPE END: ", nativeEvent);
          if (
            nativeEvent.velocityX >= 1000 ||
            (nativeEvent.velocityX > -1000 &&
              nativeEvent.translationX >= width / 2)
          ) {
            Animated.timing(animValue, {
              toValue: width,
              duration: 100,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) {
                onBackSwipe(nextIndex, true);
              }
            });
          } else {
            Animated.timing(animValue, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) {
                onBackSwipe(prevIndex);
              }
            });
          }
          break;
        case State.BEGAN:
          // console.log("SWIPE BEGAN: ", nativeEvent);
          break;
        default:
          // console.log("SWIPE UNKNOWN STATE: ", nativeEvent);
          break;
      }
    },
    [animValue, nextIndex, prevIndex, onBackSwipe]
  );

  return (
    <PanGestureHandler
      minDist={5}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onStateChange}
    >
      <Animated.View
        style={[styles.container, { top: navBarHeight }]}
        collapsable={false}
      />
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 30,
    // backgroundColor: "green",
    // opacity: 0.2
  },
});
