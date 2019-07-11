// @flow
import * as React from "react";
import { StatusBar } from 'react-native';
import { Router } from "./components";
import { MainScreen } from "./screens";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor('transparent');

export class App extends React.Component<{}> {
  render() {
    return <Router initialNode={<MainScreen />} />;
  }
}
