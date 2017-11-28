import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Suburbs from '../suburbs';

Meteor.methods({
  'suburbs.search.all': function searchStylists(keyword) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(keyword, String);

    try {
      const nameSelector = { active: true, name: RegExp(`^${keyword}`, 'i') };
      const postcodeSelector = { active: true, postcode: RegExp(`^${keyword}`, 'i') };

      return Suburbs.find(_.isNumber(keyword) ? postcodeSelector : nameSelector, {
        fields: {
          name: 1,
          postcode: 1,
        },
      }).fetch();
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
