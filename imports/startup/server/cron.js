import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import log from 'winston';

SyncedCron.config({
  logger: log,
});

SyncedCron.add({
  name: 'Refresh all suburbs .published field',
  schedule(parser) {
    return parser.text('every hour');
  },
  job() {
    Meteor.call('suburbs.refresh.published', {}, (error) => {
      if (error) {
        log.error('suburbs.refresh.published', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Update all stylists .occupiedTimeSlots field',
  schedule(parser) {
    return parser.text('every 2160 hours'); // 90 days
  },
  job() {
    Meteor.call('stylist.occupiedTimeSlots.refresh', { days: 90 }, (error) => {
      if (error) {
        log.error('stylist.occupiedTimeSlots.refresh', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Cancel overdue pending bookings',
  schedule(parser) {
    return parser.text('at 1:00am everyday');
  },
  job() {
    Meteor.call('bookings.cancel.overdue.pending', (error) => {
      if (error) {
        log.error('bookings.cancel.overdue.pending', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Notify administrators and stylists of pending bookings',
  schedule(parser) {
    return parser.text('at 9:00am everyday');
  },
  job() {
    Meteor.call('bookings.remind.pending', (error) => {
      if (error) {
        log.error('bookings.remind.pending', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Notify stylists to complete booking',
  schedule(parser) {
    return parser.text('at 10:00am everyday');
  },
  job() {
    Meteor.call('bookings.remind.complete', (error) => {
      if (error) {
        log.error('bookings.remind.complete', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Remind customers to review completed bookings',
  schedule(parser) {
    return parser.text('at 10:00am everyday');
  },
  job() {
    Meteor.call('bookings.remind.review', (error) => {
      if (error) {
        log.error('bookings.remind.review', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Send stylists signup daily report',
  schedule(parser) {
    return parser.text('at 9:00am everyday');
  },
  job() {
    Meteor.call('report.stylist.signUps', (error) => {
      if (error) {
        log.error('report.stylist.signUps', error);
      }
    });
  },
});

SyncedCron.start();
