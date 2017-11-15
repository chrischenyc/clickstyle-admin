import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import rateLimit from '../../../modules/server/rate-limit';
import Services from '../services';

Meteor.methods({
  'service.update.displayOrder': function serviceUpdateDisplayOrder(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { up, _id } = data;
    check(up, Boolean);
    check(_id, String);

    try {
      const service = Services.findOne({ _id });
      if (service) {
        if (up) {
          // find higher ordered service next to current one
        } else {
          // find lower ordered service next to current one
        }
      }
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['service.update.displayOrder'],
  limit: 5,
  timeRange: 1000,
});
