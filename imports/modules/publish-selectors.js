import { Meteor } from 'meteor/meteor';
import _ from 'lodash';

export const usersFindSelector = (filter, search) => {
  const roleSelector = {
    roles: {
      $in: [
        Meteor.settings.public.roles.customer,
        Meteor.settings.public.roles.stylist,
        Meteor.settings.public.roles.admin,
      ],
    },
  };
  if (filter === 'customer') {
    roleSelector.roles = Meteor.settings.public.roles.customer;
  } else if (filter === 'stylist') {
    roleSelector.roles = Meteor.settings.public.roles.stylist;
  } else if (filter === 'admin') {
    roleSelector.roles = Meteor.settings.public.roles.admin;
  }

  let selector = roleSelector;
  if (!_.isEmpty(search)) {
    const emailSelector = { 'emails.0.address': RegExp(search, 'i') };
    const registeredEmailSelector = { 'registered_emails.0.address': RegExp(search, 'i') };
    const firstNameSelector = { 'profile.name.first': RegExp(search, 'i') };
    const lastNameSelector = { 'profile.name.last': RegExp(search, 'i') };

    selector = {
      ...roleSelector,
      $or: [emailSelector, registeredEmailSelector, firstNameSelector, lastNameSelector],
    };
  }

  return selector;
};

export const suburbsFindSelector = (filter, search) => {
  let selector = {};
  if (filter === 'published') {
    selector.published = true;
  } else if (filter === 'active') {
    selector.active = true;
  } else if (filter === 'inactive') {
    selector.active = false;
  }

  if (!_.isEmpty(search)) {
    selector = {
      ...selector,
      $or: [{ name: RegExp(`^${search}`, 'i') }, { postcode: RegExp(`^${search}`, 'i') }],
    };
  }

  return selector;
};
