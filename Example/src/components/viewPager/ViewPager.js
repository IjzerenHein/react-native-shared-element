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
};

const VIEWABILITY_CONFIG = {
  minimumViewTime: 0,
  viewAreaCoveragePercentThreshold: 51,
};

export class ViewPager extends React.PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      selectedIndex: props.initialItemIndex || 0,
    };
  }

  render() {
    const {
      style,
      data,
      initialItemIndex,
      renderItem,
      getItemLayout,
    } = this.props;
    return (
      <FlatList
        style={style}
        horizontal
        pagingEnabled
        data={data}
        initialScrollIndex={initialItemIndex}
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
