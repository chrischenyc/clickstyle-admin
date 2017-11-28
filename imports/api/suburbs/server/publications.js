import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import { suburbsFindSelector } from '../../../modules/publish-selectors';
import Suburbs from '../suburbs';

Meteor.publish('suburbs', function users(filter, search, page, limit) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    return null;
  }

  check(filter, String);
  check(search, String);
  check(page, Number);
  check(limit, Number);

  if (['all', 'published', 'active', 'inactive'].indexOf(filter) === -1) {
    return null;
  }

  // config query based on filter
  const selector = suburbsFindSelector(filter, search);

  console.log(selector);

  return Suburbs.find(selector, {
    limit,
    skip: page * limit,
  });
});
