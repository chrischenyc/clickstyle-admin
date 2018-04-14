import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import log from 'winston';
import moment from 'moment';

import Bookings from '../bookings';
import BookingActivities from '../../booking_activities/booking_activities';
import rateLimit from '../../../modules/server/rate-limit';
import {
  sendCustomerBookingCancelledBySystemEmail,
  sendAdminEmailLongPendingBooking,
  sendStylistPendingBookingReminder,
  sendStylistCompleteBookingReminder,
  sendCustomerReviewBookingReminder,
} from '../../../modules/server/send-email';
import servicesSummary from '../../../modules/format-services';

import { parseUrlQueryDate, dateString } from '../../../modules/format-date';
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
      const pendingBookings = Bookings.find({
        status: 'pending',
        time: { $lt: new Date() },
      }).fetch();

      pendingBookings.forEach((booking) => {
        // update bookings record, insert timestamp
        Bookings.update(
          { _id: booking._id },
          { $set: { status: 'cancelled', systemCancelledAt: Date.now() } },
        );

        // notify customer via email
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

        // notify customer via in-site notification
        Meteor.call('notifications.create', {
          recipient: booking.customer,
          content:
            "Your overdue booking request has been cancelled by system as it hasn't received stylist response",
          type: 'error',
          dismissible: true,
          dismissed: false,
          link: `/users/bookings/${booking._id}`,
        });

        // create BookingActivities record
        BookingActivities.insert({
          booking: booking._id,
          stylist: booking.stylist,
          customer: booking.customer,
          user: 'system',
          action: 'cancelled',
        });

        log.info(`Overdue pending booking ${booking._id} has been cancelled by system.`);
      });
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },

  'bookings.remind.pending': function informAdminOfLongPendingBookings() {
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
      const bookings = Bookings.find({
        status: 'pending',
        remindedPendingAt: { $exists: false },
        createdAt: {
          $lte: moment()
            .subtract(1, 'days')
            .toDate(),
        },
      }).fetch();

      bookings.forEach((booking) => {
        sendAdminEmailLongPendingBooking(booking._id);

        const { name, email } = Profiles.findOne({ owner: booking.stylist });
        sendStylistPendingBookingReminder({
          stylistEmail: email,
          stylistFirstName: name.first,
          firstName: booking.firstName,
          lastName: booking.lastName,
          bookingId: booking._id,
          bookingUrl: `/users/stylist/bookings/${booking._id}`,
        });

        Bookings.update({ _id: booking._id }, { $set: { remindedPendingAt: Date.now() } });

        // notify stylist via in-site notification
        Meteor.call('notifications.create', {
          recipient: booking.stylist,
          content: `${
            booking.firstName
          } has been waiting for your to confirm a booking request for over 24 hours, please response ASAP`,
          type: 'warning',
          dismissible: true,
          dismissed: false,
          link: `/users/stylist/bookings/${booking._id}`,
        });

        log.info(`Informed long pending booking ${booking._id}.`);
      });
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },

  'bookings.remind.complete': function remindStylistToCompleteBooking() {
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
      const bookings = Bookings.find({
        status: 'confirmed',
        remindedCompleteAt: { $exists: false },
        time: {
          $lte: moment()
            .subtract(1, 'days')
            .toDate(),
        },
      }).fetch();

      bookings.forEach((booking) => {
        const { name, email } = Profiles.findOne({ owner: booking.stylist });
        sendStylistCompleteBookingReminder({
          stylistEmail: email,
          stylistFirstName: name.first,
          firstName: booking.firstName,
          lastName: booking.lastName,
          bookingId: booking._id,
          bookingUrl: `/users/stylist/bookings/${booking._id}`,
        });

        Bookings.update({ _id: booking._id }, { $set: { remindedCompleteAt: Date.now() } });

        // notify stylist via in-site notification
        Meteor.call('notifications.create', {
          recipient: booking.stylist,
          content: "Don't forget to complete this booking so you can get paid",
          type: 'success',
          dismissible: true,
          dismissed: false,
          link: `/users/stylist/bookings/${booking._id}`,
        });

        log.info(`Informed to complete ${booking._id}.`);
      });
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },

  'bookings.remind.review.completed': function remindCustomersReviewCompletedBookings() {
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
      const bookings = Bookings.find({
        status: 'completed',
        stylistCompletedAt: {
          $exists: true,
          $lte: moment()
            .subtract(1, 'days')
            .toDate(),
        },
        customerReviewedAt: { $exists: false },
        remindedReviewAt: { $exists: false },
      }).fetch();

      bookings.forEach((booking) => {
        const { name: stylistName } = Profiles.findOne({ owner: booking.stylist });
        const { email } = Profiles.findOne({ owner: booking.customer });

        sendCustomerReviewBookingReminder({
          email,
          stylistFirstName: stylistName.first,
          firstName: booking.firstName,
          bookingId: booking._id,
          bookingUrl: `/users/bookings/${booking._id}`,
        });

        Bookings.update({ _id: booking._id }, { $set: { remindedReviewAt: Date.now() } });

        // notify customer via in-site notification
        Meteor.call('notifications.create', {
          recipient: booking.customer,
          content: `How was the service? Please give ${stylistName.first} a review!`,
          type: 'success',
          dismissible: true,
          dismissed: false,
          link: `/users/bookings/${booking._id}`,
        });

        log.info(`Reminded customer to review booking ${booking._id}.`);
      });
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },

  'bookings.find': function findBooking(_id) {
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
  methods: [
    'bookings.cancel.overdue',
    'bookings.remind.pending',
    'bookings.remind.complete',
    'bookings.find',
    'bookings.remind.review.completed',
  ],
  limit: 5,
  timeRange: 1000,
});
