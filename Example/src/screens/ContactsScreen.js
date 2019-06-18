// @flow
import * as React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { ContactListItem, Router, NavBar } from "../components";
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
  }
});

export class ContactsScreen extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <NavBar title="Contacts" back="none" />
        <ScrollView style={styles.content}>
          {Contacts.map(contact => (
            <ContactListItem
              key={`contact${contact.id}`}
              contact={contact}
              onPress={this.onPressContact}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  onPressContact = (contact: Contact) => {
    Router.push(<ContactScreen contact={contact} />, {
      sharedElements: {
        [`contactPhoto.${contact.id}`]: true
      }
    });
  };
}
