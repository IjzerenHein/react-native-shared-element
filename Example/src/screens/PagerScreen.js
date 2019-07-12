// @flow
import * as React from 'react';
import { StyleSheet, View, Image, Dimensions, Animated, StatusBar } from 'react-native';
import { NavBar, ScreenTransition, Colors, Router } from '../components';
import type { Hero } from '../types';
import { Heroes } from '../assets';
import { fadeIn } from '../transitions';
import { PanGestureHandler, State, FlatList } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.dark,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    width: WIDTH,
    height: HEIGHT,
  },
  content: {
    flex: 1,
    marginVertical: NavBar.HEIGHT,
  },
  itemContainer: {
    width: WIDTH,
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
});

type PropsType = {
  hero: Hero;
}
type StateType = {
  selectedHero: Hero
}

export class PagerScreen extends React.Component<PropsType, StateType> {
  _dismissAnimValue = new Animated.Value(0);
  _onDismissGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: this._dismissAnimValue } }],
    { useNativeDriver: true }
  );

  constructor(props: PropsType) {
    super(props);
    this.state = {
      selectedHero: props.hero,
    };
  }

  render() {
    const { hero } = this.props;
    const { selectedHero } = this.state;
    const dismissAnimValue = this._dismissAnimValue;
    const initialIndex = Heroes.findIndex(({id}) => id === hero.id);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" animated/>
        <Animated.View style={[styles.background, {
          opacity: dismissAnimValue.interpolate({
            inputRange: [-400, -300, -50, 50, 300, 400],
            outputRange: [0.6, 0.6, 1, 1, 0.6, 0.6],
          }),
        }]}>
          <NavBar back="close" light title={selectedHero.name} onBack={this.onBack}/>
        </Animated.View>
        <PanGestureHandler
          onGestureEvent={this._onDismissGestureEvent}
          onHandlerStateChange={this._onDismissGestureStateChange}>
          <Animated.View style={[styles.content, {
            transform: [{translateY: Animated.multiply(dismissAnimValue, 0.5)}],
          }]}>
            <FlatList
              style={styles.scrollView}
              horizontal
              pagingEnabled
              data={Heroes}
              initialScrollIndex={initialIndex}
              renderItem={this.renderItem}
              getItemLayout={this.getItemLayout}
              onViewableItemsChanged={this.onViewableItemsChanged}
              keyExtractor={this.keyExtractor} />
            </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }

  keyExtractor = (item: any) => item.id;

  getItemLayout = (item: any, index: number) => ({length: WIDTH, offset: WIDTH * index, index});

  renderItem = ({ item }: any) => {
    const hero = item;
    const { id, photo } = hero;
    return (
      <View style={styles.itemContainer}>
        <ScreenTransition sharedId={`heroPhoto.${id}`} style={styles.flex}>
          <Image style={styles.image} source={photo} />
        </ScreenTransition>
      </View>
    );
  }

  onViewableItemsChanged = ({ viewableItems }: any) => {
    const selectedHero = viewableItems[0].item;
    if (this.state.selectedHero !== selectedHero) {
      this.setState({
        selectedHero,
      });
    }
  }

  onBack = () => {
    const hero = this.state.selectedHero;
    const sharedElements = {
      [`heroPhoto.${hero.id}`]: 'move',
    };
    Router.pop({
      sharedElements,
      transitionConfig: fadeIn(),
    });
  }

  _onDismissGestureStateChange = (event: any) => {
    const { nativeEvent } = event;
    if (nativeEvent.state !== State.END) {return;}
    if (Math.abs(nativeEvent.translationY) >= 300) {
      this.onBack();
    }
    else {
      Animated.spring(this._dismissAnimValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };
}
