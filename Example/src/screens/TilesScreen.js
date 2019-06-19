// @flow
import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import {
  ContactListItem,
  Router,
  NavBar,
  ScreenTransition
} from "../components";
import { Contacts } from "../assets";
import { ContactScreen } from "./ContactScreen";
import type { Contact } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1
  },
  item: {
    height: 100
  },
  image: {
    // flex: 1,
    height: 100,
    width: "100%",
    resizeMode: "cover"
  }
});

export class TilesScreen extends React.Component<{}> {
  renderItem(contact: Contact) {
    return (
      <TouchableOpacity
        key={`contact${contact.id}`}
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.onPressItem(contact)}
      >
        <ScreenTransition sharedId={`contactPhoto.${contact.id}`}>
          <Image style={styles.image} source={contact.photo} />
        </ScreenTransition>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title="Tiles" back="none" />
        <ScrollView style={styles.content}>
          {Contacts.map(item => this.renderItem(item))}
        </ScrollView>
      </View>
    );
  }

  onPressItem = (contact: Contact) => {
    Router.push(<ContactScreen contact={contact} />, {
      sharedElements: {
        [`contactPhoto.${contact.id}`]: true
      }
    });
  };
}
