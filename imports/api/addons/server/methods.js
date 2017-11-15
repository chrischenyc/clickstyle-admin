import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import rateLimit from '../../../modules/server/rate-limit';
import Addons from '../addons';

Meteor.methods({
  'addon.publish': function publishAddon(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, publish } = data;
    check(_id, String);
    check(publish, Boolean);

    try {
      Addons.update({ _id }, { $set: { public: publish } });
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
