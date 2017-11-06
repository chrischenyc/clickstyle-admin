import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { publishComposite } from 'meteor/reywood:publish-composite';

import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';
import Services from '../../services/services';

Meteor.publishComposite('stylist.applications', function stylistApplications(
  filter,
  page = 0,
  limit,
) {
  check(filter, String);
  check(page, Number);
  check(limit, Number);

  if (['all', 'pending', 'approved'].indexOf(filter) === -1) {
    return null;
  }

  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  return {
    find() {
      const selector = {};
      if (filter === 'pending') {
        selector.approved = false;
      } else if (filter === 'approved') {
        selector.approved = true;
      }

      return StylistApplications.find(selector, {
        sort: { createdAt: -1 },
        fields: { address: 0, qualificationUrl: 0, referenceUrl: 0 },
        limit,
        skip: page * limit,
      });
    },
    children: [
      {
        find(application) {
          return Profiles.find(
            { owner: application.userId },
            { fields: { owner: 1, email: 1, name: 1 } },
          );
        },
      },
      {
        find(application) {
          return Services.find({ _id: { $in: application.services } }, { fields: { name: 1 } });
        },
      },
    ],
  };
});

Meteor.publishComposite('stylist.application', function stylistApplication(_id) {
  check(_id, String);

  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

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
