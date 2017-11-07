import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import Profiles from '../profiles';

Meteor.publish('profile', function profile(owner) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(owner, String);

  return Profiles.find(
    { owner },
    {
      fields: {
        owner: 1,
        email: 1,
        name: 1,
        mobile: 1,
        about: 1,
        photo: 1,
        products: 1,
        stylist: 1,
      },
    },
  );
});
