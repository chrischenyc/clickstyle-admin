import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
}
