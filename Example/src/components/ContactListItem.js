// @flow
import * as React from 'react';
import { ListItem } from './ListItem';
import type { Contact } from '../types';

export interface ContactListItemProps {
  contact: Contact;
  onPress?: (contact: Contact) => void;
}

export class ContactListItem extends React.Component<ContactListItemProps> {
  render() {
    const { contact, ...otherProps } = this.props;
    return (
      <ListItem
        {...otherProps}
        label={contact.name}
        image={contact.photo}
        imageSharedId={`contactPhoto.${contact.id}`}
        data={contact}
      />
    );
  }
}
