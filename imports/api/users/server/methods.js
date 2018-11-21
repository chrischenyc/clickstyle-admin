import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import Profiles from '../../profiles/profiles';
import Stylists from '../../stylists/stylists';
import Suburbs from '../../suburbs/suburbs';

import rateLimit from '../../../modules/server/rate-limit';
import { sendAdminAccessGrantEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'users.grant.admin': function usersGrantAdmin(data) {
    if (
      !Roles.userIsInRole(this.userId, [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { userId, grant } = data;
    check(userId, String);
    check(grant, Boolean);

    if (grant) {
      Roles.addUsersToRoles(userId, [Meteor.settings.public.roles.admin]);
    } else {
      Roles.removeUsersFromRoles(userId, [Meteor.settings.public.roles.admin]);
    }

    sendAdminAccessGrantEmail(userId, grant, this.userId);

    log.info(
      'Meteor.methods: users.grant.admin',
      `userId: ${this.userId}`,
      `param: ${JSON.stringify(data)}`,
    );
  },
});

Meteor.methods({
  'user.find': function findUser(_id) {
    if (
      !Roles.userIsInRole(this.userId, [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      return null;
    }

    check(_id, String);

    let user = Meteor.users.findOne({ _id });

    const profile = Profiles.findOne({ owner: _id });
    user = { ...user, profile };

    if (Roles.userIsInRole(_id, [Meteor.settings.public.roles.stylist])) {
      const stylist = Stylists.findOne({ owner: _id });

      if (stylist.areas && stylist.areas.availableSuburbs) {
        const suburbs = Suburbs.find({ _id: { $in: stylist.areas.availableSuburbs } }).fetch();
        stylist.areas.availableSuburbs = suburbs;
      }

      user = { ...user, stylist };
    }

    return user;
  },
});

rateLimit({
  methods: ['users.grant.admin', 'user.find'],
  limit: 5,
  timeRange: 1000,
});
