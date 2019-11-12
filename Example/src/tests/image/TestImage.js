// @flow
import * as React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import {Colors, SharedElement} from '../../components';
import type {Hero, Size, Position, ResizeMode} from '../../types';
import {Heroes} from '../../assets';
import ImageZoom from 'react-native-image-pan-zoom';

const SIZES = {
  max: Dimensions.get('window').width,
  small: 120,
  regular: 200,
  large: 280,
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').width,
    backgroundColor: Colors.back,
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
  },
  top: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
  },
  bottom: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // TODO
  },
  max: {
    flex: 1,
    width: '100%',
  },
});

type PropsType = {
  style?: any,
  hero: Hero,
  end?: boolean,
  size: Size,
  position: Position,
  resizeMode: ResizeMode,
  round?: boolean,
  ImageComponent: any,
  panZoom?: boolean,
  navigation?: any,
};

export class TestImage extends React.Component<PropsType> {
  static defaultProps = {
    hero: Heroes[0],
    style: {},
    size: 'default',
    position: 'default',
    resizeMode: 'cover',
    round: false,
    ImageComponent: Image,
    panZoom: false,
  };

  render() {
    const {
      style,
      hero,
      end,
      size,
      position,
      resizeMode,
      round,
      ImageComponent,
      panZoom,
      navigation,
    } = this.props;
    const sizePx = SIZES[size === 'default' ? 'regular' : size];
    const resolvedPosition =
      position === 'default' ? (end ? 'right' : 'left') : position;
    const imageContent = (
      <SharedElement
        id="testContent"
        style={size === 'max' ? {flex: 1} : undefined}
        navigation={navigation}>
        <ImageComponent
          style={[
            styles.image,
            {
              width: sizePx,
              height: sizePx,
              borderRadius: round ? sizePx / 2 : 0,
            },
            style,
          ]}
          resizeMode={resizeMode}
          source={hero.photo}
        />
      </SharedElement>
    );
    const content = panZoom ? (
      <ImageZoom
        cropWidth={SIZES.max}
        cropHeight={SIZES.max}
        imageWidth={sizePx}
        imageHeight={sizePx}>
        {imageContent}
      </ImageZoom>
    ) : (
      imageContent
    );

    return (
      <View
        style={[
          styles.container,
          size !== 'max' ? styles[resolvedPosition] : undefined,
        ]}>
        {content}
      </View>
    );
  }
}
