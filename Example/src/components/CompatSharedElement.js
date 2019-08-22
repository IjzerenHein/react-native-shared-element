// @flow
import * as React from "react";
import { RouterScreenTransition } from "./RouterScreenTransition";
import { SharedElement as ReactNavigationCoreSharedElement } from "react-navigation-sharedelement";

type PropsType = {
  id?: string,
  navigation?: any,
  children: any
};

export class CompatSharedElement extends React.Component<PropsType> {
  render() {
    const { navigation, id, ...otherProps } = this.props;

    return navigation ? (
      <ReactNavigationCoreSharedElement id={id} {...otherProps} />
    ) : (
      <RouterScreenTransition sharedId={id} {...otherProps} />
    );
  }
}

export const SharedElement = CompatSharedElement;
