// @flow
import * as React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Colors, SharedElement} from '../../components';
import type {Size, Position} from '../../types';

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
  color: string,
  end?: boolean,
  size: Size,
  position: Position,
  round?: boolean,
  navigation?: any,
};

export class TestView extends React.Component<PropsType> {
  static defaultProps = {
    style: {},
    color: Colors.blue,
    size: 'default',
    position: 'default',
    round: false,
  };

  render() {
    const {style, color, end, size, position, round, navigation} = this.props;
    const sizePx = SIZES[size === 'default' ? 'regular' : size];
    const resolvedPosition =
      position === 'default' ? (end ? 'right' : 'left') : position;
    return (
      <View
        style={[
          styles.container,
          size !== 'max' ? styles[resolvedPosition] : undefined,
        ]}>
        <SharedElement
          id="testContent"
          style={size === 'max' ? {flex: 1} : undefined}
          navigation={navigation}>
          <View
            style={[
              {
                width: sizePx,
                height: sizePx,
                borderRadius: round ? sizePx / 2 : 0,
                backgroundColor: color,
              },
              style,
            ]}
          />
        </SharedElement>
      </View>
    );
  }
}
