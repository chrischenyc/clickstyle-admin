import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import Bookings from '../bookings';

Meteor.publish('bookings', function bookings(filter, page, limit) {
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

  if (
    ['all', 'pending', 'confirmed', 'cancelled', 'declined', 'completed'].indexOf(filter) === -1
  ) {
    return null;
  }

  const selector = {};
  if (filter !== 'all') {
    selector.status = filter;
  }

  return Bookings.find(selector, {
    limit,
    skip: page * limit,
    order: { createdAt: -1 },
  });
});
