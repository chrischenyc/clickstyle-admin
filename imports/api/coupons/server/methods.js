import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import log from 'winston';

import Coupons from '../coupons';
import rateLimit from '../../../modules/server/rate-limit';

Meteor.methods({
  'coupons.find': function findBooking(_id) {
    if (
      Meteor.isClient &&
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(_id, String);

    try {
      const coupon = Coupons.findOne({ _id });

      return coupon;
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },
});

rateLimit({
  methods: ['coupons.find'],
  limit: 5,
  timeRange: 1000,
});
