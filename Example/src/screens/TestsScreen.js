// @flow
import * as React from 'react';
import {StyleSheet, ScrollView, View, Platform} from 'react-native';
import {Router, NavBar, ListItem, Colors} from '../components';
import {TestScreen} from './TestScreen';
import type {Test, TestGroup} from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: Platform.select({
    ios: {
      flex: 1,
      backgroundColor: Colors.empty,
    },
    android: {
      flex: 1,
    },
  }),
});

type PropsType = {
  tests: Array<Test | TestGroup>,
  title?: string,
  description?: string,
  navigation?: any,
};

export class TestsScreen extends React.Component<PropsType> {
  render() {
    const {title, navigation} = this.props;
    const tests = navigation ? navigation.getParam('tests') : this.props.tests;
    return (
      <View style={styles.container}>
        {!navigation ? (
          <NavBar title={title || 'Tests'} zIndex={100} />
        ) : (
          undefined
        )}
        <ScrollView style={styles.content} endFillColor={Colors.empty}>
          {tests.map((test, index) => (
            <ListItem
              key={`item${index}`}
              label={test.name}
              onPress={() => this.onPressItem(test)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  onPressItem = (test: Test | TestGroup) => {
    const {navigation} = this.props;
    const description = navigation
      ? navigation.getParam('description')
      : this.props.description;
    if (navigation) {
      if (test.tests) {
        navigation.push('Tests', {
          title: test.name,
          description: test.description,
          tests: test.tests,
        });
      } else {
        navigation.push('Test', {
          test: test,
          description: description || '',
        });
      }
    } else {
      Router.push(
        test.tests ? (
          <TestsScreen
            tests={test.tests}
            title={test.name}
            description={test.description}
          />
        ) : (
          <TestScreen test={test} description={description || ''} />
        )
      );
    }
  };
}
