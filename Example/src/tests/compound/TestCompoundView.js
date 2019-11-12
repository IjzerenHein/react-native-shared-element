// @flow
import * as React from 'react';
import {StyleSheet, View, Image, Dimensions, Text} from 'react-native';
import {Colors, Shadows, SharedElement, LinearGradient} from '../../components';
import type {Hero, Size, Position} from '../../types';
import {Heroes} from '../../assets';

const SIZES = {
  max: Dimensions.get('window').width,
  small: 30,
  regular: 60,
  large: 80,
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').width,
    backgroundColor: Colors.back,
    ...Shadows.elevation1,
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
  logo: {
    resizeMode: 'cover',
  },
  image: {
    resizeMode: 'cover',
  },
  text: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    ...Shadows.elevation1,
    backgroundColor: Colors.back,
    alignItems: 'center',
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
  vertical: boolean,
  navigation?: any,
};

export class TestCompoundView extends React.Component<PropsType> {
  static defaultProps = {
    hero: Heroes[0],
    style: {},
    size: 'default',
    position: 'default',
    vertical: false,
  };

  render() {
    const {style, hero, end, size, position, vertical, navigation} = this.props;
    const isMax = size === 'max';
    const resolvedPosition =
      position === 'default'
        ? isMax
          ? 'center'
          : end
          ? 'right'
          : 'left'
        : position;
    const sizePx = SIZES[size === 'default' ? 'regular' : size];
    return (
      <View
        style={[
          styles.container,
          !isMax ? styles[resolvedPosition] : undefined,
        ]}>
        <SharedElement id="testContent" navigation={navigation}>
          <View
            style={[
              styles.content,
              isMax
                ? undefined
                : {
                    flexDirection: vertical ? 'column-reverse' : 'row-reverse',
                    borderRadius: (sizePx + sizePx / 2.5) / 2,
                  },
              style,
            ]}>
            <View>
              <SharedElement id="testImage" navigation={navigation}>
                <Image
                  style={[
                    styles.image,
                    isMax
                      ? {
                          width: sizePx,
                          height: sizePx,
                        }
                      : {
                          width: sizePx,
                          height: sizePx,
                          borderRadius: sizePx / 2,
                          margin: sizePx / 8,
                        },
                  ]}
                  source={hero.photo}
                />
              </SharedElement>
              <SharedElement
                id="testOverlay"
                style={StyleSheet.absoluteFill}
                navigation={navigation}>
                {isMax ? (
                  <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={['#000000FF', '#00000000', '#000000FF']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                  />
                ) : (
                  <View
                    style={{
                      width: sizePx,
                      height: sizePx,
                      borderRadius: sizePx / 2,
                      margin: sizePx / 8,
                    }}
                  />
                )}
              </SharedElement>
            </View>
            <SharedElement
              id="testTitle"
              style={
                isMax
                  ? {
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 20,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }
                  : undefined
              }
              navigation={navigation}>
              <Text
                style={[
                  styles.text,
                  isMax
                    ? {
                        fontSize: sizePx / 8,
                        color: Colors.back,
                      }
                    : {
                        fontSize: sizePx / 2.3,
                        margin: sizePx / 8,
                      },
                ]}>
                {hero.name}
              </Text>
            </SharedElement>
            <SharedElement
              id="testLogo"
              style={isMax ? StyleSheet.absoluteFill : undefined}
              navigation={navigation}>
              <Image
                style={[
                  styles.logo,
                  isMax
                    ? {
                        position: 'absolute',
                        left: 20,
                        top: 20,
                        width: 30,
                        height: 30,
                      }
                    : {
                        width: sizePx / 2,
                        height: sizePx / 2,
                        borderRadius: sizePx / 4,
                        margin: sizePx / 5,
                      },
                ]}
                source={require('../../assets/fist.png')}
              />
            </SharedElement>
          </View>
        </SharedElement>
      </View>
    );
  }
}
