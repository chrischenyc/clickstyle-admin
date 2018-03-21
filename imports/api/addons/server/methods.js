import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Addons from '../addons';

Meteor.methods({
  'addon.publish': function publishAddon(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, publish } = data;
    check(_id, String);
    check(publish, Boolean);

    try {
      Addons.update({ _id }, { $set: { published: publish } });

      log.info(
        'Meteor.methods: addon.publish',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
  'addon.remove': function removeAddon(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id } = data;
    check(_id, String);

    try {
      Addons.remove({ _id });

      log.info(
        'Meteor.methods: addon.remove',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
  'addon.update.duration': function updateAddonDuration(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, duration } = data;
    check(_id, String);
    check(duration, Number);

    try {
      Addons.update({ _id }, { $set: { duration } });

      log.info(
        'Meteor.methods: addon.update.duration',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['addon.publish', 'addon.remove', 'addon.update.duration'],
  limit: 5,
  timeRange: 1000,
});
