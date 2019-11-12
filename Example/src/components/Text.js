// @flow
import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Colors} from './Colors';

const styles = StyleSheet.create({
  heading1: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.text,
  },
  heading2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.text,
  },
  heading3: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray,
  },
  body: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.gray,
  },
  light: {
    color: Colors.back,
  },
});

export const Heading1 = (props: any) => {
  const {light, ...otherProps} = props;
  return (
    <Text
      {...otherProps}
      style={[styles.heading1, light ? styles.light : undefined, props.style]}
    />
  );
};
export const Heading2 = (props: any) => {
  const {light, ...otherProps} = props;
  return (
    <Text
      {...otherProps}
      style={[styles.heading2, light ? styles.light : undefined, props.style]}
    />
  );
};
export const Heading3 = (props: any) => {
  const {light, ...otherProps} = props;
  return (
    <Text
      {...otherProps}
      style={[styles.heading3, light ? styles.light : undefined, props.style]}
    />
  );
};
export const Caption = (props: any) => {
  const {light, ...otherProps} = props;
  return (
    <Text
      {...otherProps}
      style={[styles.caption, light ? styles.light : undefined, props.style]}
    />
  );
};
export const Body = (props: any) => {
  const {light, ...otherProps} = props;
  return (
    <Text
      {...otherProps}
      style={[styles.body, light ? styles.light : undefined, props.style]}
    />
  );
};
