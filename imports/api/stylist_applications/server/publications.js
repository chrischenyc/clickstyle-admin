import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { publishComposite } from 'meteor/reywood:publish-composite';

import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';
import Services from '../../services/services';

Meteor.publish('stylist.applications', function stylistApplications(filter, page, limit) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(filter, String);
  check(page, Number);
  check(limit, Number);

  if (['all', 'pending', 'approved'].indexOf(filter) === -1) {
    return null;
  }

  const selector = {};
  if (filter === 'pending') {
    selector.approved = false;
  } else if (filter === 'approved') {
    selector.approved = true;
  }

  return StylistApplications.find(selector, {
    limit,
    skip: page * limit,
    fields: {
      approved: 1,
      createdAt: 1,
      mobile: 1,
      userId: 1,
      name: 1,
      email: 1,
    },
  });
});

Meteor.publishComposite('stylist.application', function stylistApplication(_id) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(_id, String);

  return {
    find() {
      return StylistApplications.find({ _id });
    },
    children: [
      {
        find(application) {
          return Profiles.find({ owner: application.userId });
        },
      },
      {
        find(application) {
          return Services.find({ _id: { $in: application.services } }, { fields: { name: 1 } });
        },
      },
      {
        find(application) {
          return Meteor.users.find({ _id: application.approvedBy }, { fields: { profile: 1 } });
        },
      },
    ],
  };
});
