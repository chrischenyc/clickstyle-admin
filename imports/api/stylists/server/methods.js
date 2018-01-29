import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';
import moment from 'moment';
import _ from 'lodash';

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
      const stylistOwnerIds = stylists.map(stylist => stylist.owner);
      const profiles = Profiles.find(
        { owner: { $in: stylistOwnerIds } },
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

// add occupied timeslots for the recurring closed hours from today to n days later
Meteor.methods({
  'stylist.occupiedTimeSlots.refresh': function refreshPublishedSuburbs(data) {
    if (
      Meteor.isClient &&
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { days } = data;
    check(days, Number);

    try {
      const stylists = Stylists.find().fetch();
      stylists.forEach((stylist) => {
        const { _id, occupiedTimeSlots, openHours } = stylist;
        let newOccupiedTimeSlots = _.isEmpty(occupiedTimeSlots) ? [] : [...occupiedTimeSlots];

        const today = moment();

        for (let index = 0; index < days; index += 1) {
          const timeSlotsOfDay = [];

          const day = today.add(moment.duration(index, 'd'));
          const weekDay = day.weekday();
          const openHour = openHours[weekDay];
          const dateString = day.format('YYMMDD');

          if (!openHour.open) {
            // if closed, fill the day with a single occupied timeslot
            timeSlotsOfDay.push({
              from: parseInt(`${dateString}0000`, 10),
              to: parseInt(`${dateString}2359`, 10),
              state: 'off',
            });
          } else {
            // else, fill the day with occupied timeslots before/after open/close time

            const openAtHour = parseInt(openHour.openAt.split(':')[0], 10);
            const openAtMinute = parseInt(openHour.openAt.split(':')[1], 10);
            const closeAtHour = parseInt(openHour.closeAt.split(':')[0], 10);
            const closeAtMinute = parseInt(openHour.closeAt.split(':')[1], 10);

            if (!(openAtHour === 0 && openAtMinute === 0)) {
              timeSlotsOfDay.push({
                from: parseInt(`${dateString}0000`, 10),
                to: parseInt(dateString + openHour.openAt.replace(':', ''), 10),
                state: 'off',
              });
            }

            if (!(closeAtHour === 23 && closeAtMinute === 59)) {
              timeSlotsOfDay.push({
                from: parseInt(dateString + openHour.closeAt.replace(':', ''), 10),
                to: parseInt(`${dateString}2359`, 10),
                state: 'off',
              });
            }
          }

          // merge day's timeslots back to master array
          newOccupiedTimeSlots = [...newOccupiedTimeSlots, ...timeSlotsOfDay];
        }

        newOccupiedTimeSlots = _.uniq(newOccupiedTimeSlots);

        // update record
        Stylists.update({ _id }, { $set: { occupiedTimeSlots: newOccupiedTimeSlots } });
      });

      log.info('Meteor.methods: stylist.occupiedTimeSlots.refresh');
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['stylist.publish', 'stylists.search', 'stylist.occupiedTimeSlots.refresh'],
  limit: 5,
  timeRange: 1000,
});
