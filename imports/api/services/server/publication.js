import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Services from '../services';

Meteor.publish('services', function services() {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  return Services.find();
});
