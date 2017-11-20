import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../stylists';

Meteor.methods({
  'stylist.publish': function publishStylist(data) {
    if (
      !Roles.userIsInRole(this.userId, [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { userId, publish } = data;
    check(userId, String);
    check(publish, Boolean);

    Stylists.update({ owner: userId }, { $set: { public: publish } });

    log.info(
      'Meteor.methods: stylist.publish',
      `userId: ${this.userId}`,
      `param: ${JSON.stringify(data)}`,
    );
  },
});

rateLimit({
  methods: ['stylist.publish'],
  limit: 5,
  timeRange: 1000,
});
