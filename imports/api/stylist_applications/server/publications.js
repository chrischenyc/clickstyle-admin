import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import StylistApplications from '../stylist_applications';

Meteor.publish('stylist.applications', function stylistApplications(filter, page, limit) {
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

  if (['all', 'pending', 'approved'].indexOf(filter) === -1) {
    return null;
  }

  const selector = {};
  if (filter === 'pending') {
    selector.approved = false;
  } else if (filter === 'approved') {
    selector.approved = true;
  }

  return StylistApplications.find(selector, {
    limit,
    skip: page * limit,
    fields: {
      approved: 1,
      createdAt: 1,
      mobile: 1,
      userId: 1,
      name: 1,
      email: 1,
      experienceYears: 1,
    },
  });
});

Meteor.publish('stylist.application', function stylistApplication(_id) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(_id, String);

  return StylistApplications.find({ _id });
});
