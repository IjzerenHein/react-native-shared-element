// @flow
import * as React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Heading2 } from "./Text";
import { ScreenTransition } from "./ScreenTransition";
import { Colors } from "./Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.back,
    height: 60,
    paddingHorizontal: 16
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: "cover",
    marginRight: 16,
    shadowColor: "#000",
    /*shadowOffset: {
      width: 0,
      height: 11
    },*/
    shadowOpacity: 0.55,
    shadowRadius: 14.78
    //borderWidth: 4,
    //borderColor: "orange"
  }
});

export interface ListItemProps {
  label: string;
  image?: any;
  imageSharedId?: string;
  data?: any;
  onPress?: (data: any) => void;
}

export class ListItem extends React.Component<ListItemProps> {
  renderImage() {
    const { image, imageSharedId } = this.props;
    if (!image && !imageSharedId) return;
    if (imageSharedId) {
      return (
        <ScreenTransition sharedId={imageSharedId}>
          <Image style={styles.image} source={image} />
        </ScreenTransition>
      );
    } else {
      return <Image style={styles.image} source={image} />;
    }
  }

  render() {
    const { label, onPress } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!onPress}
        onPress={this.onPress}
      >
        <View style={styles.container}>
          {this.renderImage()}
          <Heading2>{label}</Heading2>
        </View>
      </TouchableOpacity>
    );
  }

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.data);
    }
  };
}
