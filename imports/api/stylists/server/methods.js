import { Meteor } from 'meteor/meteor';

import rateLimit from '../../../modules/server/rate-limit';

import publishStylist from './publish-stylist';
import { searchStylists, countStylists } from './search-stylists';
import refreshStylistTimeSlots from './refresh-stylist-time-slots';
import reportStylistServices from './report-stylist-services';
import reportStylistSuburbs from './report-stylist-suburbs';

Meteor.methods({
  'stylists.search': searchStylists,
  'stylists.count': countStylists,
  'stylist.publish': publishStylist,
  'stylist.occupiedTimeSlots.refresh': refreshStylistTimeSlots,
  'report.stylist.services': reportStylistServices,
  'report.geo': reportStylistSuburbs,
});

rateLimit({
  methods: [
    'stylist.publish',
    'stylists.search',
    'stylists.count',
    'stylist.occupiedTimeSlots.refresh',
    'report.stylist.services',
    'report.geo',
  ],
  limit: 5,
  timeRange: 1000,
});
