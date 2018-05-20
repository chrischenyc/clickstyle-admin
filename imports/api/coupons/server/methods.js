import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import log from 'winston';
import couponCode from 'coupon-code';

import Coupons from '../coupons';
import rateLimit from '../../../modules/server/rate-limit';

const generateUniqueCoupon = () => {
  let code = null;

  do {
    code = couponCode.generate({ partLen: 8, parts: 1 });
  } while (Coupons.findOne({ code }));

  return code;
};

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

  'coupons.create': function createCoupons(data) {
    if (
      Meteor.isClient &&
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);

    const {
      discount, minBookingValue, expiry, quantity, print,
    } = data;

    try {
      const codes = [];
      for (let index = 0; index < quantity; index += 1) {
        const code = generateUniqueCoupon();
        if (code) {
          Coupons.insert({
            code,
            discount,
            minBookingValue,
            createdBy: this.userId,
            status: print ? 'printed' : 'new',
            expiry,
            printedAt: print ? Date.now() : null,
            printedBy: print ? this.userId : null,
          });

          codes.push(code);
        }
      }

      return codes;
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },
});

rateLimit({
  methods: ['coupons.find', 'coupons.create'],
  limit: 5,
  timeRange: 1000,
});
