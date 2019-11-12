// @flow
import * as React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import {Colors, SharedElement} from '../../components';
import type {Position, Size} from '../../types';

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
    paddingVertical: 20,
  },
  top: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
    paddingVertical: 20,
  },
  bottom: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontWeight: '500',
  },
});

const FontSizes = {
  max: 32,
  small: 13,
  regular: 17,
  large: 30,
};

type TextLength = 'word' | 'words' | 'sentence' | 'paragraph';

const TextContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const TextLengths: {[key: string]: number} = {
  word: 5,
  words: 11,
  sentence: TextContent.indexOf('.') + 1,
  paragraph: TextContent.length,
};

type PropsType = {
  style?: any,
  color: string,
  end?: boolean,
  size: Size,
  position: Position,
  length: TextLength | number,
  scale?: number,
  navigation?: any,
};

export class TestText extends React.Component<PropsType> {
  static defaultProps = {
    style: {},
    color: Colors.blue,
    position: 'default',
    size: 'default',
    length: 'words',
    scale: 1,
  };

  render() {
    const {
      style,
      color,
      end,
      size,
      position,
      length,
      scale,
      navigation,
    } = this.props;
    const fontSize = FontSizes[size === 'default' ? 'regular' : size];
    const resolvedPosition =
      position === 'default' ? (end ? 'bottom' : 'top') : position;
    const textLength =
      typeof length === 'number' ? length : TextLengths[length];
    const width =
      textLength > 20 && (position === 'left' || position === 'right')
        ? Dimensions.get('window').width / 2
        : undefined;
    return (
      <View
        style={[
          styles.container,
          size !== 'max' ? styles[resolvedPosition] : undefined,
        ]}>
        <SharedElement
          id="testContent"
          style={[
            size === 'max' ? {flex: 1} : undefined,
            {transform: [{scale}]},
          ]}
          navigation={navigation}>
          <Text
            style={[
              styles.text,
              {
                fontSize,
                color,
                width,
              },
              style,
            ]}>
            {TextContent.substring(0, textLength)}
          </Text>
        </SharedElement>
      </View>
    );
  }
}
