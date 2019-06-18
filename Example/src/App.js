// @flow
import * as React from 'react';
import { Router } from './components';
import { ContactsScreen } from './screens';

export class App extends React.Component<{}> {
  render() {
    return <Router initialNode={<ContactsScreen />} />;
  }
}
