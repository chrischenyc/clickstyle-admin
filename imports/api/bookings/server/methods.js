import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';
import moment from 'moment';

import Bookings from '../bookings';
import rateLimit from '../../../modules/server/rate-limit';
import { sendCustomerBookingCancelledBySystemEmail } from '../../../modules/server/send-email';
import servicesSummary from '../../../modules/format-services';

import { parseUrlQueryDate, dateString, parseBookingDateTime } from '../../../modules/format-date';
import Stylists from '../../stylists/stylists';

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
});

rateLimit({
  methods: ['bookings.cancel.overdue'],
  limit: 5,
  timeRange: 1000,
});
