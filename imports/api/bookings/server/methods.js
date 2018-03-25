import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import log from 'winston';
import moment from 'moment';

import Bookings from '../bookings';
import rateLimit from '../../../modules/server/rate-limit';
import {
  sendCustomerBookingCancelledBySystemEmail,
  sendAdminEmailLongPendingBooking,
} from '../../../modules/server/send-email';
import servicesSummary from '../../../modules/format-services';

import { parseUrlQueryDate, dateString, parseBookingDateTime } from '../../../modules/format-date';
import Stylists from '../../stylists/stylists';
import Profiles from '../../profiles/profiles';

Meteor.methods({
  'bookings.cancel.overdue': function cancelOverdueBookings() {
    if (
      Meteor.isClient &&
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const pendingBookings = Bookings.find({ status: 'pending' }).fetch();

      pendingBookings.forEach((booking) => {
        const bookingStartDateTime = parseBookingDateTime(booking.date + booking.time);

        if (bookingStartDateTime.isBefore(moment())) {
          // update bookings record, insert timestamp
          Bookings.update(
            { _id: booking._id },
            { $set: { status: 'cancelled', systemCancelledAt: Date.now() } },
          );

          // notify customer
          const stylist = Stylists.findOne({ owner: booking.stylist });
          const {
            services,
            total,
            firstName,
            lastName,
            email,
            mobile,
            address,
            date,
            time,
          } = booking;

          sendCustomerBookingCancelledBySystemEmail({
            stylist: `${stylist.name.first} ${stylist.name.last}`,
            services: servicesSummary(services),
            total,
            firstName,
            lastName,
            email,
            mobile,
            address,
            time: `${dateString(parseUrlQueryDate(date))} ${time}`,
            bookingsId: booking._id,
            bookingUrl: `/users/bookings/${booking._id}`,
          });

          log.info(`Overdue pending booking ${booking._id} has been cancelled by system.`);
        }
      });
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },

  'bookings.inform.admin.long.pending': function informAdminOfLongPendingBookings() {
    if (
      Meteor.isClient &&
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const pendingBookings = Bookings.find({
        status: 'pending',
        informedAdminOfLongPendingAt: { $exists: false },
      }).fetch();

      pendingBookings.forEach((booking) => {
        const bookingStartDateTime = parseBookingDateTime(booking.date + booking.time);

        if (bookingStartDateTime.isBefore(moment().subtract(1, 'day'))) {
          sendAdminEmailLongPendingBooking(booking._id);

          Bookings.update(
            { _id: booking._id },
            { $set: { informedAdminOfLongPendingAt: Date.now() } },
          );

          log.info(`Informed admin of long pending booking ${booking._id}.`);
        }
      });
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },

  'find.booking': function findBooking(_id) {
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
      const booking = Bookings.findOne({ _id });

      const customer = Profiles.findOne({ owner: booking.customer });
      const stylist = Profiles.findOne({ owner: booking.stylist });

      return { ...booking, customer, stylist };
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },
});

rateLimit({
  methods: ['bookings.cancel.overdue', 'bookings.inform.admin.long.pending', 'find.booking'],
  limit: 5,
  timeRange: 1000,
});
