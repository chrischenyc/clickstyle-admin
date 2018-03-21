import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';
import Stylists from '../../stylists/stylists';
import Services from '../../services/services';
import { sendStylistJoinApprovedEmail } from '../../../modules/server/send-email';
import { calculateOccupiedTimeSlots } from '../../../modules/server/update-stylist-occupied-timeslots';

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
                },
              },
            );

            // default open/close hours
            const openHours = [
              {
                day: 1,
                open: true,
                openAt: '09:00',
                closeAt: '17:00',
              },
              {
                day: 2,
                open: true,
                openAt: '09:00',
                closeAt: '17:00',
              },
              {
                day: 3,
                open: true,
                openAt: '09:00',
                closeAt: '17:00',
              },
              {
                day: 4,
                open: true,
                openAt: '09:00',
                closeAt: '17:00',
              },
              {
                day: 5,
                open: true,
                openAt: '09:00',
                closeAt: '17:00',
              },
              {
                day: 6,
                open: false,
                openAt: '09:00',
                closeAt: '17:00',
              },
              {
                day: 7,
                open: false,
                openAt: '09:00',
                closeAt: '17:00',
              },
            ];

            // add baseDuration to service(s)
            const updatedServices = services.map((service) => {
              const { duration: baseDuration } = Services.findOne({ _id: service._id });
              return { ...service, baseDuration };
            });

            const { name, photo } = Profiles.findOne({ owner: userId });

            Stylists.insert({
              services: updatedServices,
              qualificationUrl,
              referenceUrl,
              owner: userId,
              openHours,
              published: false,
              occupiedTimeSlots: calculateOccupiedTimeSlots([], openHours, 90),
              favourites: [],
              reviews: [],
              portfolioPhotos: [],
              name,
              address: { raw: address },
              photo,
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
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['stylist.application.approve'],
  limit: 5,
  timeRange: 1000,
});
