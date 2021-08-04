import * as React from "react";
import { createNativeWrapper } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

// TODO: fix touch events are not routed to the viewpager
const RNGHPagerView = createNativeWrapper(PagerView, {
  disallowInterruption: true,
});

type PropsType = {
  style?: any;
  data: any[];
  renderItem: (data: { item: any; index: number }) => any;
  getItemLayout: (item: any, index: number) => any;
  initialItemIndex: number;
  onItemSelected: (index: number) => any;
};
type StateType = object;

export class ViewPager extends React.PureComponent<PropsType, StateType> {
  render() {
    const { style, data, initialItemIndex, renderItem } = this.props;
    return (
      <RNGHPagerView
        style={style}
        initialPage={initialItemIndex}
        onPageSelected={this.onPageSelected}
      >
        {data.map((item, index) =>
          renderItem({
            item,
            index,
          })
        )}
      </RNGHPagerView>
    );
  }

  onPageSelected = ({ nativeEvent }: any) => {
    const { onItemSelected } = this.props;
    if (onItemSelected) onItemSelected(nativeEvent.position);
  };
}
