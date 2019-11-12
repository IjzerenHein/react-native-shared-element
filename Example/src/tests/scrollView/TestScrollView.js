// @flow
import * as React from 'react';
import {StyleSheet, View, FlatList, Image, Dimensions} from 'react-native';
import {Colors, SharedElement} from '../../components';
import type {Hero, Size} from '../../types';
import {Heroes} from '../../assets';

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: 'dashed',
  },
});

type PropsType = {
  horizontal: boolean,
  inverted: boolean,
  size: Size,
  round?: boolean,
  ImageComponent: any,
  heroes: Hero[],
  navigation?: any,
};

const heroes2 = [...Heroes];
heroes2[0] = Heroes[1];
heroes2[1] = Heroes[0];

export class TestScrollView extends React.Component<PropsType> {
  static defaultProps = {
    horizontal: false,
    inverted: false,
    size: 'default',
    ImageComponent: Image,
    heroes: heroes2,
  };

  render() {
    const {heroes, size, horizontal, inverted} = this.props;
    const sizePx = SIZES[size === 'default' ? 'regular' : size];
    const isMax = size === 'max';
    return (
      <View style={styles.container}>
        <View
          style={{
            width: sizePx,
            height: sizePx,
          }}>
          <FlatList
            style={!isMax ? styles.scrollView : undefined}
            horizontal={horizontal}
            inverted={inverted}
            data={heroes}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
      </View>
    );
  }

  keyExtractor = (item: any) => item.id;

  renderItem = ({item, index}: any) => {
    const hero = item;
    const {size, ImageComponent, round, horizontal, navigation} = this.props;
    const sizePx = SIZES[size === 'default' ? 'regular' : size];
    const isMax = size === 'max';
    const sizeStyle = {
      width: horizontal ? sizePx / (isMax ? 3.5 : 1.5) : sizePx,
      height: horizontal ? sizePx : sizePx / (isMax ? 3.5 : 1.5),
    };

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
          navigation={navigation}>
          {content}
        </SharedElement>
      );
    } else {
      return content;
    }
  };
}
