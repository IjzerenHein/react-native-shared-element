// @flow
import * as React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Router,
  NavBar,
  ScreenTransition,
  Colors,
  Heading2,
  Caption,
} from '../components';
import type { SharedElementAnimation } from 'react-native-shared-element-transition';
import { Heroes } from '../assets';
import type { Hero } from '../types';
import { fadeIn } from '../transitions';
import type { TransitionConfig } from 'react-navigation';

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  overlay: {
    borderRadius: 40,
  },
  content: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    marginBottom: 4,
    flexDirection: 'row',
  },
});

type PropsType = {
  title: string,
  animation: SharedElementAnimation,
  DetailComponent: any,
  transitionConfig: TransitionConfig
};

export class ListScreen extends React.Component<PropsType> {
  static defaultProps = {
    title: 'Bullets',
    animation: 'move',
    transitionConfig: fadeIn(),
  };

  renderItem(hero: Hero) {
    const { id, name, photo, quote } = hero;
    return (
      <TouchableOpacity
        key={`Hero${id}`}
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}
      >
        <View style={styles.image}>
          <ScreenTransition sharedId={`heroPhoto.${id}`}>
            <Image style={styles.image} source={photo} resizeMode="cover" />
          </ScreenTransition>
          <ScreenTransition
            sharedId={`heroPhotoOverlay.${id}`}
            style={StyleSheet.absoluteFill}
          >
            <View
              style={[StyleSheet.absoluteFill, styles.overlay]}
              collapsable={false}
            />
          </ScreenTransition>
        </View>
        <View style={styles.content}>
          <View style={styles.name}>
            <ScreenTransition sharedId={`heroName.${id}`}>
              <Heading2>{name}</Heading2>
            </ScreenTransition>
          </View>
          <Caption>{quote || ''}</Caption>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={title} />
        <ScrollView style={styles.flex}>
          {Heroes.map(item => this.renderItem(item))}
        </ScrollView>
      </View>
    );
  }

  onPressItem = (hero: Hero) => {
    const { animation, DetailComponent, transitionConfig } = this.props;
    const sharedElements = {
      [`heroPhoto.${hero.id}`]: animation,
      [`heroPhotoOverlay.${hero.id}`]: 'dissolve',
      [`heroName.${hero.id}`]: animation,
    };
    Router.push(<DetailComponent hero={hero} />, {
      sharedElements,
      transitionConfig,
    });
  };
}
