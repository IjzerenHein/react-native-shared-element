// @flow
import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import {NavBar, SharedElement, Colors, Router, ViewPager} from '../components';
import type {Hero, SharedElementsConfig} from '../types';
import {Heroes} from '../assets';
import {fadeIn} from '../transitions';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

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
  content: {
    flex: 1,
    marginVertical: NavBar.HEIGHT,
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
});

type PropsType = {
  hero: Hero,
  navigation: any,
};
type StateType = {
  selectedHero: Hero,
  width: number,
};

export class PagerScreen extends React.Component<PropsType, StateType> {
  static navigationOptions = {
    header: null,
  };

  static sharedElements = (
    navigation: any,
    otherNavigation: any,
    showing: boolean
  ): ?SharedElementsConfig => {
    const hero = navigation.getParam('hero');
    return [`heroPhoto.${hero.id}`];
  };

  _dismissAnimValue = new Animated.Value(0);
  _onDismissGestureEvent = Animated.event(
    [{nativeEvent: {translationY: this._dismissAnimValue}}],
    {useNativeDriver: true}
  );

  constructor(props: PropsType) {
    super(props);
    const hero = props.navigation
      ? props.navigation.getParam('hero')
      : props.hero;
    this.state = {
      selectedHero: hero,
      width: Dimensions.get('window').width,
    };
  }

  renderPager(items: Hero[], initialIndex: number) {
    return (
      <ViewPager
        style={styles.flex}
        data={items}
        initialItemIndex={initialIndex}
        renderItem={this.renderItem}
        getItemLayout={this.getItemLayout}
        onItemSelected={this.onItemSelected}
      />
    );
  }

  render() {
    const {navigation} = this.props;
    const hero = navigation ? navigation.getParam('hero') : this.props.hero;
    const {selectedHero} = this.state;
    const dismissAnimValue = this._dismissAnimValue;
    const initialIndex = Heroes.findIndex(({id}) => id === hero.id);
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <StatusBar barStyle="light-content" animated />
        <Animated.View
          style={[
            styles.background,
            {
              opacity: dismissAnimValue.interpolate({
                inputRange: [-400, -300, -50, 50, 300, 400],
                outputRange: [0.6, 0.6, 1, 1, 0.6, 0.6],
              }),
            },
          ]}>
          <NavBar
            back="close"
            light
            title={selectedHero.name}
            onBack={this.onBack}
          />
        </Animated.View>
        <PanGestureHandler
          onGestureEvent={this._onDismissGestureEvent}
          onHandlerStateChange={this._onDismissGestureStateChange}>
          <Animated.View
            style={[
              styles.content,
              {
                transform: [
                  {translateY: Animated.multiply(dismissAnimValue, 0.5)},
                ],
              },
            ]}>
            {this.renderPager(Heroes, initialIndex)}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }

  onLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    if (this.state.width !== width) {
      this.setState({
        width,
      });
    }
  };

  getItemLayout = (item: any, index: number) => {
    const {width} = this.state;
    return {
      length: width,
      offset: width * index,
      index,
    };
  };

  renderItem = ({item}: any) => {
    const {width} = this.state;
    const hero = item;
    const {id, photo} = hero;
    return (
      <View style={{width}} key={`item.${item.id}`}>
        <SharedElement
          id={`heroPhoto.${id}`}
          style={styles.flex}
          navigation={this.props.navigation}>
          <Image style={styles.image} source={photo} />
        </SharedElement>
      </View>
    );
  };

  onItemSelected = (index: number) => {
    this.updateHero(Heroes[index]);
  };

  updateHero(hero: Hero) {
    const {navigation} = this.props;
    if (this.state.selectedHero === hero) return;
    this.setState({
      selectedHero: hero,
    });
    if (navigation) navigation.setParams({hero});
  }

  onBack = () => {
    const {navigation} = this.props;
    const hero = this.state.selectedHero;
    if (navigation) {
      navigation.goBack();
    } else {
      Router.pop({
        sharedElements: [`heroPhoto.${hero.id}`],
        transitionConfig: fadeIn(),
      });
    }
  };

  _onDismissGestureStateChange = (event: any) => {
    const {nativeEvent} = event;
    if (nativeEvent.state !== State.END) {
      return;
    }
    if (Math.abs(nativeEvent.translationY) >= 300) {
      this.onBack();
    } else {
      Animated.spring(this._dismissAnimValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };
}
