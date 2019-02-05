import { Meteor } from 'meteor/meteor';

import rateLimit from '../../../modules/server/rate-limit';

import publishStylist from './publish-stylist';
import { searchStylists, countStylists } from './search-stylists';
import refreshStylistTimeSlots from './refresh-stylist-time-slots';
import reportStylistServices from './report-stylist-services';
import reportStylistSuburbs from './report-stylist-suburbs';
import verifyStylistDocument from './verify-stylist-document';
import reportStylistSignUps from './report-stylist-signups';

Meteor.methods({
  'stylists.search': searchStylists,
  'stylists.count': countStylists,
  'stylist.publish': publishStylist,
  'stylist.occupiedTimeSlots.refresh': refreshStylistTimeSlots,
  'report.stylist.services': reportStylistServices,
  'report.geo': reportStylistSuburbs,
  'report.stylist.signUps': reportStylistSignUps,
  'stylist.verify.document': verifyStylistDocument,
});

rateLimit({
  methods: [
    'stylist.publish',
    'stylists.search',
    'stylists.count',
    'stylist.occupiedTimeSlots.refresh',
    'report.stylist.services',
    'report.geo',
    'report.stylist.signUps',
    'stylist.verify.document',
  ],
  limit: 5,
  timeRange: 1000,
});
