import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../stylists';
import Profiles from '../../profiles/profiles';
import { usersFindSelector } from '../../../modules/publish-selectors';

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

    Stylists.update({ owner: userId }, { $set: { published: publish } });

    log.info(
      'Meteor.methods: stylist.publish',
      `userId: ${this.userId}`,
      `param: ${JSON.stringify(data)}`,
    );
  },
  'stylists.search': function searchStylists(search) {
    if (
      !Roles.userIsInRole(this.userId, [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }
    check(search, String);

    try {
      const userSelector = usersFindSelector('stylist', search);
      const users = Meteor.users.find(userSelector).fetch();
      const userIds = users.map(user => user._id);

      // query Stylists
      const stylists = Stylists.find(
        { owner: { $in: userIds }, published: true },
        {
          fields: { owner: 1 },
        },
      ).fetch();

      // query Profiles
      const profiles = Profiles.find(
        { owner: { $in: userIds } },
        {
          fields: {
            owner: 1,
            name: 1,
          },
        },
      ).fetch();

      return profiles;
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['stylist.publish', 'stylists.search'],
  limit: 5,
  timeRange: 1000,
});
