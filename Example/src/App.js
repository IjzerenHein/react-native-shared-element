// @flow
import * as React from "react";
import { Router } from "./components";
import { MainScreen } from "./screens";

export class App extends React.Component<{}> {
  render() {
    return <Router initialNode={<MainScreen />} />;
  }
}
