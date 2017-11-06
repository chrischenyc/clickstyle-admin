import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';
import { sendStylistJoinApprovedEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'stylist.application.approve': function stylistApplicationApprove(data) {
    check(data, Object);
    const { applicationId, userId } = data;
    check(applicationId, String);
    check(userId, String);

    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      StylistApplications.update(
        { _id: applicationId },
        {
          $set: { approved: true, approvedBy: this.userId, approvedAt: Date.now() },
        },
        (error) => {
          if (!error) {
            Roles.addUsersToRoles(userId, [Meteor.settings.public.roles.stylist]);

            sendStylistJoinApprovedEmail(userId);
          }
        },
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
  methods: ['stylist.application.approve'],
  limit: 5,
  timeRange: 1000,
});
