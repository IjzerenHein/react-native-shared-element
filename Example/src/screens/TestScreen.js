// @flow
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavBar, Colors, Button, Body, Router} from '../components';
import {fromRight} from '../transitions';
import type {Test, SharedElementsConfig} from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.empty,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginRight: 10,
  },
  debugButton: {
    flex: 1,
  },
  body: {
    marginTop: 20,
  },
});

interface PropsType {
  test: Test;
  end?: boolean;
  description?: string;
  navigation?: any;
}

function getSharedElements(test: Test): SharedElementsConfig {
  const props = {
    animation: test.animation,
    resize: test.resize,
    align: test.align,
  };
  return test.multi
    ? [
        {id: 'testImage', ...props},
        {id: 'testOverlay', ...props, animation: test.animation || 'fade'},
        {id: 'testLogo', ...props},
        {id: 'testTitle', ...props, animation: test.animation || 'fade'},
      ]
    : [{id: 'testContent', ...props}];
}

export class TestScreen extends React.Component<PropsType> {
  static sharedElements = (
    navigation: any,
    otherNavigation: any,
    showing: boolean
  ): ?SharedElementsConfig => {
    if (otherNavigation.state.routeName !== 'Test') return;
    const test = navigation.getParam('test');
    return getSharedElements(test);
  };

  render() {
    const {navigation} = this.props;
    const test = navigation ? navigation.getParam('test') : this.props.test;
    const description = navigation
      ? navigation.getParam('description')
      : this.props.description;
    const end = navigation ? navigation.getParam('end') : this.props.end;
    return (
      <View style={styles.container}>
        {!navigation ? <NavBar title={test.name} /> : undefined}
        {React.cloneElement(end ? test.end : test.start, {
          navigation,
        })}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              label={navigation ? 'Animate' : 'Fast'}
              onPress={this.onPressButton}
            />
            {!navigation ? (
              <Button
                style={styles.button}
                label="Slow"
                onPress={this.onPressSlowButton}
              />
            ) : (
              undefined
            )}
            {!navigation ? (
              <Button
                style={styles.debugButton}
                label="Debug"
                onPress={this.onPressDebugButton}
              />
            ) : (
              undefined
            )}
          </View>
          <Body style={styles.body}>{test.description || description}</Body>
        </View>
      </View>
    );
  }

  onPressButton = () => {
    this.transition(Router.defaultProps.transitionConfig);
  };

  onPressSlowButton = () => {
    this.transition(fromRight(4000));
  };

  onPressDebugButton = () => {
    this.transition({
      ...fromRight(8000),
      debug: true,
    });
  };

  transition(transitionConfig: any) {
    const {navigation} = this.props;
    const test = navigation ? navigation.getParam('test') : this.props.test;
    const description = navigation
      ? navigation.getParam('description')
      : this.props.description;
    const end = navigation ? navigation.getParam('end') : this.props.end;
    const sharedElements = getSharedElements(test);
    if (end) {
      if (navigation) {
        navigation.goBack();
      } else {
        Router.pop({
          transitionConfig,
          sharedElements,
        });
      }
    } else {
      if (navigation) {
        navigation.push('Test', {
          test,
          description: description || '',
          end: true,
        });
      } else {
        Router.push(
          <TestScreen test={test} end description={description || ''} />,
          {transitionConfig, sharedElements}
        );
      }
    }
  }
}
