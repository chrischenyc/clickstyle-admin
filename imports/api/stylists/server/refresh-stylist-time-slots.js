import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import Stylists from '../stylists';
import { updateStylistOccupiedTimeSlots } from '../../../modules/server/update-stylist-occupied-timeslots';

// add occupied time-slots for the recurring closed hours from today to n days later
export default function refreshPublishedSuburbs(data) {
  if (
    Meteor.isClient
    && !Roles.userIsInRole(Meteor.userId(), [
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
      updateStylistOccupiedTimeSlots(stylist, days);
    });
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
