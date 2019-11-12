// @flow
import type {
  SharedElementAnimation,
  SharedElementResize,
  SharedElementAlign,
} from 'react-native-shared-element';

export type SharedElementStrictConfig = {|
  +id: string,
  +otherId: string,
  +animation: SharedElementAnimation,
  +resize?: SharedElementResize,
  +align?: SharedElementAlign,
  +debug?: boolean,
|};

export type SharedElementsStrictConfig = SharedElementStrictConfig[];

export type SharedElementConfig =
  | {|
      +id: string,
      +otherId?: string,
      +animation?: SharedElementAnimation,
      +resize?: SharedElementResize,
      +align?: SharedElementAlign,
      +debug?: boolean,
    |}
  | string;

export type SharedElementsConfig = SharedElementConfig[];

export function normalizeSharedElementConfig(
  sharedElementConfig: SharedElementConfig
): SharedElementStrictConfig {
  if (typeof sharedElementConfig === 'string') {
    return {
      id: sharedElementConfig,
      otherId: sharedElementConfig,
      animation: 'move',
    };
  } else {
    const {id, otherId, animation, ...other} = sharedElementConfig;
    return {
      id,
      otherId: otherId || id,
      animation: animation || 'move',
      ...other,
    };
  }
}

export function normalizeSharedElementsConfig(
  sharedElementsConfig?: ?SharedElementsConfig
): ?SharedElementsStrictConfig {
  if (!sharedElementsConfig || !sharedElementsConfig.length) return;
  return sharedElementsConfig.map(normalizeSharedElementConfig);
}
