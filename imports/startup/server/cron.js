import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import log from 'winston';

SyncedCron.config({
  logger: log,
});

SyncedCron.add({
  name: 'Refresh all suburbs .published field',
  schedule(parser) {
    return parser.text('every 4 hours');
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
    return parser.text('every 24 hours'); // daily
  },
  job() {
    Meteor.call('bookings.cancel.overdue', (error) => {
      if (error) {
        log.error('bookings.cancel.overdue', error);
      }
    });
  },
});

SyncedCron.add({
  name: 'Notify administrators of pending bookings over 24 hours',
  schedule(parser) {
    return parser.text('every 1 day'); // daily
  },
  job() {
    Meteor.call('bookings.remind.pending', (error) => {
      if (error) {
        log.error('bookings.remind.pending', error);
      }
    });
  },
});

SyncedCron.start();
