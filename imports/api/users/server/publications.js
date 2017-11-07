import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { publishComposite } from 'meteor/reywood:publish-composite';

import Profiles from '../../profiles/profiles';

Meteor.publish('users', function users(filter, page, limit) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(filter, String);
  check(page, Number);
  check(limit, Number);

  if (['all', 'customer', 'stylist', 'admin'].indexOf(filter) === -1) {
    return null;
  }

  // config query based on filter
  const selector = {
    roles: {
      $in: [
        Meteor.settings.public.roles.customer,
        Meteor.settings.public.roles.stylist,
        Meteor.settings.public.roles.admin,
      ],
    },
  };
  if (filter === 'customer') {
    selector.roles = Meteor.settings.public.roles.customer;
  } else if (filter === 'stylist') {
    selector.roles = Meteor.settings.public.roles.stylist;
  } else if (filter === 'admin') {
    selector.roles = Meteor.settings.public.roles.admin;
  }

  return Meteor.users.find(selector, {
    limit,
    skip: page * limit,
    fields: {
      createdAt: 1,
      emails: 1,
      profile: 1,
      roles: 1,
    },
  });
});

Meteor.publishComposite('user', function user(_id) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(_id, String);

  return {
    find() {
      return Meteor.users.find(
        { _id },
        {
          fields: {
            profile: 0,
            emails: 0,
            registered_emails: 0,
            services: 0,
          },
        },
      );
    },
    children: [
      {
        find(doc) {
          return Profiles.find(
            { owner: doc._id },
            {
              fields: {
                owner: 1,
                email: 1,
                name: 1,
                mobile: 1,
                about: 1,
                photo: 1,
              },
            },
          );
        },
      },
    ],
  };
});
