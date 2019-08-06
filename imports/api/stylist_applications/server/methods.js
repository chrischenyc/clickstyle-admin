import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import { sendStylistJoinApprovedEmail } from '../../../modules/server/send-email';

import approveApplication from './approve-application';

Meteor.methods({
  'approve.stylist.application': approveApplication,

  'stylist.application.resend.approval.email': function resendApplicationApprovalEmail(userId) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(userId, String);

    try {
      sendStylistJoinApprovedEmail(userId);
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['approve.stylist.application', 'stylist.application.resend.approval.email'],
  limit: 5,
  timeRange: 1000,
});
