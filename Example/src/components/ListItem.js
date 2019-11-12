// @flow
import * as React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {Heading3, Caption} from './Text';
import {Colors} from './Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.back,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 60,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  description: {
    marginTop: 1,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: 'cover',
    marginRight: 16,
    shadowColor: '#000',
    /*shadowOffset: {
      width: 0,
      height: 11
    },*/
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    //borderWidth: 4,
    //borderColor: "orange"
  },
});

export interface ListItemProps {
  label: string;
  description?: string;
  image?: any;
  data?: any;
  onPress?: (data: any) => void;
}

export class ListItem extends React.Component<ListItemProps> {
  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.data);
    }
  };

  renderImage() {
    const {image} = this.props;
    if (!image) {
      return;
    }
    return <Image style={styles.image} source={image} />;
  }

  render() {
    const {label, description, onPress} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!onPress}
        onPress={this.onPress}>
        <View style={styles.container}>
          {this.renderImage()}
          <View style={styles.content}>
            <Heading3>{label}</Heading3>
            {description ? (
              <Caption style={styles.description}>{description}</Caption>
            ) : (
              undefined
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
