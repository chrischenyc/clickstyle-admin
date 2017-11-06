import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { publishComposite } from 'meteor/reywood:publish-composite';

import Profiles from '../../profiles/profiles';

Meteor.publishComposite('users', function users(filter, page = 0, limit) {
  check(filter, String);
  check(page, Number);
  check(limit, Number);

  if (['all', 'customer', 'stylist', 'admin'].indexOf(filter) === -1) {
    return null;
  }

  if (!Roles.userIsInRole(this.userId, Meteor.settings.public.roles.admin)) {
    return null;
  }

  return {
    find() {
      const selector = {};
      if (filter === 'customer') {
        selector.roles = { $all: [Meteor.settings.public.roles.customer] };
      } else if (filter === 'stylist') {
        selector.roles = { $all: [Meteor.settings.public.roles.stylist] };
      } else if (filter === 'admin') {
        selector.roles = { $all: [Meteor.settings.public.roles.admin] };
      }

      return Meteor.users.find(selector, {
        fields: {
          profile: 0,
          emails: 0,
          services: 0,
          registered_emails: 0,
        },
        limit,
        skip: page * limit,
      });
    },
    children: [
      {
        find(user) {
          return Profiles.find(
            { owner: user._id },
            {
              fields: {
                owner: 1,
                email: 1,
                name: 1,
                mobile: 1,
              },
            },
          );
        },
      },
    ],
  };
});

Meteor.publishComposite('user', function user(_id) {
  check(_id, String);

  if (!Roles.userIsInRole(this.userId, Meteor.settings.public.roles.admin)) {
    return null;
  }

  return {
    find() {
      return StylistApplications.find({ _id });
    },
    children: [
      {
        find(application) {
          return Profiles.find({ owner: application.userId });
        },
      },
      {
        find(application) {
          return Services.find({ _id: { $in: application.services } }, { fields: { name: 1 } });
        },
      },
      {
        find(application) {
          return Meteor.users.find({ _id: application.approvedBy }, { fields: { profile: 1 } });
        },
      },
    ],
  };
});
