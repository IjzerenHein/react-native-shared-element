// @flow
import * as React from 'react';
import NativeViewPager from '@react-native-community/viewpager';
import {createNativeWrapper} from 'react-native-gesture-handler';

const RNGHViewPager = createNativeWrapper(NativeViewPager, {
  disallowInterruption: true,
});

type PropsType = {
  data: any[],
  renderItem: (data: {item: any, index: number}) => any,
  getItemLayout: (item: any, index: number) => any,
  initialItemIndex: number,
  onItemSelected: (index: number) => any,
};
type StateType = {};

export class ViewPager extends React.PureComponent<PropsType, StateType> {
  render() {
    const {style, data, initialItemIndex, renderItem} = this.props;
    return (
      <RNGHViewPager
        style={style}
        initialPage={initialItemIndex}
        onPageSelected={this.onPageSelected}>
        {data.map((item, index) =>
          renderItem({
            item,
            index,
          })
        )}
      </RNGHViewPager>
    );
  }

  onPageSelected = ({nativeEvent}: any) => {
    const {onItemSelected} = this.props;
    if (onItemSelected) onItemSelected(nativeEvent.position);
  };
}
