import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Suburbs from '../suburbs';

Meteor.methods({
  'suburb.activate': function activateSuburb(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, active } = data;
    check(_id, String);
    check(active, Boolean);

    try {
      Suburbs.update({ _id }, { $set: { active } });

      log.info(
        'Meteor.methods: suburb.activate',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['suburbs.search.all'],
  limit: 5,
  timeRange: 1000,
});
