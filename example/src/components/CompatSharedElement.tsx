import * as React from "react";

import { RouterScreenTransition } from "./router/RouterScreenTransition";

type Props = {
  id?: string;
  style?: any;
  navigation: any;
  children: any;
};

export function CompatSharedElement(props: Props) {
  const { navigation, id, ...otherProps } = props;
  return <RouterScreenTransition sharedId={id} {...otherProps} />;
}

export const SharedElement = CompatSharedElement;
