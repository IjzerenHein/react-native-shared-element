// @flow
import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Heading3} from './Text';
import {Shadows, Colors} from './Colors';

const HEIGHT = 40;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.elevation1,
  },
  label: {
    color: 'white',
  },
});

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  style: any;
}

export class Button extends React.Component<ButtonProps> {
  render() {
    const {label, onPress, style} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!onPress}
        onPress={onPress}
        style={style}>
        <View style={[styles.container]}>
          <Heading3 style={styles.label}>{label}</Heading3>
        </View>
      </TouchableOpacity>
    );
  }
}
