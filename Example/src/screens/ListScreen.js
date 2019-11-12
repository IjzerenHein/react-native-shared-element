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
  SharedElement,
  Colors,
  Heading2,
  Caption,
} from '../components';
import {Heroes} from '../assets';
import type {Hero, SharedElementsConfig} from '../types';
import {fadeIn} from '../transitions';

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
  DetailComponent: any,
  transitionConfig: any,
  navigation?: any,
};

export class ListScreen extends React.Component<PropsType> {
  static defaultProps = {
    title: 'Bullets',
    transitionConfig: fadeIn(),
  };

  renderItem(hero: Hero) {
    const {navigation} = this.props;
    const {id, name, photo, quote} = hero;
    return (
      <TouchableOpacity
        key={`Hero${id}`}
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.onPressItem(hero)}>
        <View style={styles.image}>
          <SharedElement id={`heroPhoto.${id}`} navigation={navigation}>
            <Image style={styles.image} source={photo} resizeMode="cover" />
          </SharedElement>
          <SharedElement
            id={`heroPhotoOverlay.${id}`}
            style={StyleSheet.absoluteFill}
            navigation={navigation}>
            <View
              style={[StyleSheet.absoluteFill, styles.overlay]}
              collapsable={false}
            />
          </SharedElement>
        </View>
        <View style={styles.content}>
          <View style={styles.name}>
            <SharedElement id={`heroName.${id}`} navigation={navigation}>
              <Heading2>{name}</Heading2>
            </SharedElement>
          </View>
          <Caption>{quote || ''}</Caption>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {title} = this.props;
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
    const {DetailComponent, transitionConfig} = this.props;
    const sharedElements: SharedElementsConfig = [
      `heroPhoto.${hero.id}`,
      {id: `heroPhotoOverlay.${hero.id}`, animation: 'fade'},
      `heroName.${hero.id}`,
    ];
    Router.push(<DetailComponent hero={hero} />, {
      sharedElements,
      transitionConfig,
    });
  };
}
