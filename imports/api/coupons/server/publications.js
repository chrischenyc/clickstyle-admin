import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import Coupons from '../coupons';

Meteor.publish('coupons', function bookings(filter, page, limit) {
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

  if (['all', 'new', 'printed', 'redeemed', 'expired'].indexOf(filter) === -1) {
    return null;
  }

  const selector = {};
  if (filter !== 'all') {
    selector.status = filter;
  }

  return Coupons.find(selector, {
    limit,
    skip: page * limit,
    order: { createdAt: -1 },
  });
});
