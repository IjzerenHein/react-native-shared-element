// @flow
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Heading1, NavBar, ScreenTransition } from "../components";
import type { Contact } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover"
  }
});

interface ContactScreenProps {
  contact: Contact;
}

export class ContactScreen extends React.Component<ContactScreenProps> {
  render() {
    const { name, photo, id } = this.props.contact;
    return (
      <View style={styles.container}>
        <NavBar title={name} back="close" />
        <View style={styles.content}>
          <ScreenTransition
            sharedId={`contactPhoto.${id}`}
            style={styles.content}
          >
            <Image style={styles.image} source={photo} />
          </ScreenTransition>
        </View>
      </View>
    );
  }
}
