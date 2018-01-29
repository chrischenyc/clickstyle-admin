import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import log from 'winston';

SyncedCron.config({
  logger: log,
});

SyncedCron.add({
  name: 'Refresh Suburbs.published status based on current Stylists data',
  schedule(parser) {
    // parser is a later.parse object
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
  name: 'Refresh Stylists.occupiedTimeSlots for 90 days from now',
  schedule(parser) {
    return parser.text('every 90 days');
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

SyncedCron.start();
