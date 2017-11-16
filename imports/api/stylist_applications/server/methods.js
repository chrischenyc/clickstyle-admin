import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';
import Stylists from '../../stylists/stylists';
import { sendStylistJoinApprovedEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'stylist.application.approve': function stylistApplicationApprove(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { applicationId, userId } = data;
    check(applicationId, String);
    check(userId, String);

    try {
      StylistApplications.update(
        { _id: applicationId },
        {
          $set: { approved: true, approvedBy: this.userId, approvedAt: Date.now() },
        },
        (error) => {
          if (!error) {
            Roles.addUsersToRoles(userId, [Meteor.settings.public.roles.stylist]);

            // after approve, copy application data to user's profile
            // then create a Stylists collection record
            const application = StylistApplications.findOne({ _id: applicationId });
            const {
              services, qualificationUrl, referenceUrl, mobile, address,
            } = application;

            Profiles.update(
              { owner: userId },
              {
                $set: {
                  mobile,
                  address: { raw: address },
                  stylist: { services, qualificationUrl, referenceUrl },
                },
              },
            );

            Stylists.insert({
              services,
              qualificationUrl,
              referenceUrl,
              owner: userId,
            });

            sendStylistJoinApprovedEmail(userId);

            log.info(
              'Meteor.methods: stylist.application.approve',
              `userId: ${this.userId}`,
              `param: ${JSON.stringify(data)}`,
            );
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
