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
    log.info('cron job - suburbs.refresh.published');
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
    log.info('cron job - stylist.occupiedTimeSlots.refresh');
  },
});

SyncedCron.add({
  name: 'Cancel overdue pending bookings',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job() {
    Meteor.call('bookings.cancel.overdue', (error) => {
      if (error) {
        log.error('bookings.cancel.overdue', error);
      }
    });
    log.info('cron job - Cancel pending Bookings that are overdue');
  },
});

SyncedCron.start();
