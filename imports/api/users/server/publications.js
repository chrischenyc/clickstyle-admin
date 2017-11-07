import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

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

Meteor.publish('user', function user(_id) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(_id, String);

  return Meteor.users.find(
    { _id },
    {
      fields: {
        createdAt: 1,
        roles: 1,
      },
    },
  );
});
