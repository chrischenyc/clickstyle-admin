// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Notifications = new Mongo.Collection('notifications');

Notifications.allow({
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
Notifications.deny({
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

Notifications.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const NotificationsSchema = new SimpleSchema({
  recipient: String, // user id
  content: String,
  type: String, // conversation, system
  dismissible: Boolean,
  dismissed: Boolean,
  link: String, // link to a conversation, or a booking, or a static page
});

Notifications.attachSchema(NotificationsSchema);

export default Notifications;
