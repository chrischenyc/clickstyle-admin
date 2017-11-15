import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import rateLimit from '../../../modules/server/rate-limit';
import Services from '../services';

Meteor.methods({
  'services.update': function serviceUpdateDisplayOrder(services) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(services, Array);

    try {
      services.forEach((service) => {
        Services.update({ _id: service._id }, { $set: { displayOrder: service.displayOrder } });
      });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['services.update'],
  limit: 5,
  timeRange: 1000,
});
