import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UserContacts = new Mongo.Collection('user_contacts');

UserContacts.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});
UserContacts.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

UserContacts.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
  updatedAt: false,
});

const UserContactsSchema = new SimpleSchema({
  // required fields
  userId: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  phone: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
    max: 20,
  },
  subject: String,
  message: String,
});

UserContacts.attachSchema(UserContactsSchema);

export default UserContacts;
