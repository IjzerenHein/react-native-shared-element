import * as React from "react";

import { RouterScreenTransition } from "./RouterScreenTransition";

type PropsType = {
  id?: string;
  style?: any;
  navigation: any;
  children: any;
};

export class CompatSharedElement extends React.Component<PropsType> {
  render() {
    const { navigation, id, ...otherProps } = this.props;
    return <RouterScreenTransition sharedId={id} {...otherProps} />;
  }
}

export const SharedElement = CompatSharedElement;
