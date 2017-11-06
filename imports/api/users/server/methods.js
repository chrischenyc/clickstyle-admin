import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

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
  },
});

rateLimit({
  methods: ['users.grant.admin'],
  limit: 5,
  timeRange: 1000,
});
