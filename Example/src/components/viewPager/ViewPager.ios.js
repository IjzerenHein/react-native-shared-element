// @flow
import * as React from 'react';
import {FlatList} from 'react-native';

type PropsType = {
  style: any,
  data: any[],
  renderItem: (data: {item: any, index: number}) => any,
  getItemLayout: (item: any, index: number) => any,
  initialItemIndex: number,
  onItemSelected: (index: number) => any,
};
type StateType = {
  selectedIndex: number,
  contentOffset: {
    x: number,
    y: number,
  },
};

const VIEWABILITY_CONFIG = {
  minimumViewTime: 0,
  viewAreaCoveragePercentThreshold: 51,
};

export class ViewPager extends React.PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const {data, getItemLayout, initialItemIndex = 0} = props;
    const initialOffset = getItemLayout(
      data[initialItemIndex],
      initialItemIndex
    ).offset;
    const contentOffset = {x: initialOffset, y: 0};
    this.state = {
      selectedIndex: initialItemIndex,
      contentOffset,
    };
  }

  render() {
    const {style, data, renderItem, getItemLayout} = this.props;
    const {contentOffset} = this.state;
    return (
      <FlatList
        style={style}
        horizontal
        pagingEnabled
        data={data}
        initialNumToRender={10}
        contentOffset={contentOffset}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={this.keyExtractor}
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />
    );
  }

  keyExtractor = (item: any, index: number) => `item${index}`;

  onViewableItemsChanged = (event: any) => {
    const {onItemSelected, data} = this.props;
    const {viewableItems} = event;
    if (!viewableItems.length) return;
    const selectedItem = viewableItems[0].item;
    const selectedIndex = data.indexOf(selectedItem);
    if (this.state.selectedIndex !== selectedIndex) {
      this.setState(
        {
          selectedIndex,
        },
        () => {
          if (onItemSelected) onItemSelected(selectedIndex);
        }
      );
    }
  };
}
