import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import StylistApplications from '../stylist_applications';

Meteor.publish('stylists.applications', function stylistsApplications() {
  if (Roles.userIsInRole(this.userId, Meteor.settings.public.roles.admin)) {
    return StylistApplications.find(
      {},
      { sort: { createdAt: -1 }, fields: { address: 0, qualificationUrl: 0, referenceUrl: 0 } },
    );
  }

  return null;
});
