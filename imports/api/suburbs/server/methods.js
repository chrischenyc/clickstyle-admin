import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Suburbs from '../suburbs';
import Stylists from '../../stylists/stylists';

Meteor.methods({
  'suburb.activate': function activateSuburb(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, active } = data;
    check(_id, String);
    check(active, Boolean);

    try {
      Suburbs.update({ _id }, { $set: { active } });

      log.info(
        'Meteor.methods: suburb.activate',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

Meteor.methods({
  'suburbs.refresh.published': function refreshPublishedSuburbs(data) {
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

    try {
      // get all servicing suburbs
      let servicingSuburbIds = Stylists.find(
        { published: true },
        { fields: { 'areas.availableSuburbs': 1 } },
      )
        .fetch()
        .filter(stylist => stylist.areas && stylist.areas.availableSuburbs)
        .map(stylist => stylist.areas.availableSuburbs);

      servicingSuburbIds = _.flatMapDeep(servicingSuburbIds);
      servicingSuburbIds = _.uniq(servicingSuburbIds);

      Suburbs.update(
        { _id: { $in: servicingSuburbIds }, active: true, published: false },
        { $set: { published: true } },
        { multi: true },
      );
      Suburbs.update(
        { _id: { $nin: servicingSuburbIds }, active: true, published: true },
        { $set: { published: false } },
        { multi: true },
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['suburb.activate', 'suburbs.refresh.published'],
  limit: 5,
  timeRange: 1000,
});
