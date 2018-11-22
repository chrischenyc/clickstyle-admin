import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import Stylists from '../stylists';
import { usersFindSelector } from '../../../modules/publish-selectors';

const searchStylistsWithParams = (params) => {
  const {
    search, published, page, limit,
  } = params;

  let stylistsSelector = {};

  if (search && search.length > 0) {
    const userSelector = usersFindSelector('stylist', search);
    const users = Meteor.users.find(userSelector).fetch();
    const userIds = users.map(user => user._id);

    stylistsSelector = { ...stylistsSelector, owner: { $in: userIds } };
  }

  stylistsSelector = { ...stylistsSelector, published };

  const stylists = Stylists.find(
    stylistsSelector,
    { skip: page * limit, limit },
    {
      fields: { owner: 1, name: 1, photo: 1 },
    },
  ).fetch();

  return stylists;
};

export function searchStylists(params) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  check(params, Object);

  const {
    search, published, page, limit,
  } = params;

  if (search) {
    check(search, String);
  }

  if (published) {
    check(published, Boolean);
  }

  if (page) {
    check(page, Number);
  }

  if (limit) {
    check(limit, Number);
  }

  try {
    return searchStylistsWithParams(params);
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}

export function countStylists(params) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  check(params, Object);

  const { search, published } = params;

  if (search) {
    check(search, String);
  }

  if (published) {
    check(published, Boolean);
  }

  try {
    return searchStylistsWithParams(params).length;
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
