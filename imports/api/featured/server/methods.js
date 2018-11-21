import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../../stylists/stylists';
import Featured from '../featured';

Meteor.methods({
  'featured.home.stylists': function searchFeaturedStylistsOnHome() {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      // add query selector by available suburbs
      const { homeFeaturedStylists } = Featured.findOne();

      // query home featured
      const stylistIds = homeFeaturedStylists.map(stylist => stylist.owner);

      // query Stylists
      const stylists = Stylists.find(
        { owner: { $in: stylistIds } },
        {
          fields: { owner: 1, name: 1, photo: 1 },
        },
      )
        .fetch()
        .map((stylist) => {
          // insert display order
          const { displayOrder } = homeFeaturedStylists.filter(
            featured => featured.owner === stylist.owner,
          )[0];

          return {
            ...stylist,
            displayOrder,
          };
        })
        .sort((l, r) => l.displayOrder - r.displayOrder);

      return stylists;
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
  'feature.home.stylist': function featureStylistOnHome(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, feature } = data;
    check(_id, String);
    check(feature, Boolean);

    try {
      let homeFeaturedStylists = Featured.findOne().homeFeaturedStylists;
      homeFeaturedStylists = _.sortBy(homeFeaturedStylists, 'displayOrder');

      if (feature) {
        if (_.findIndex(homeFeaturedStylists, stylist => stylist.owner === _id) === -1) {
          homeFeaturedStylists.push({ owner: _id });
        }
      } else {
        homeFeaturedStylists = homeFeaturedStylists.filter(stylist => stylist.owner !== _id);
      }

      // update display order
      homeFeaturedStylists = homeFeaturedStylists.map((stylist, index) => ({
        owner: stylist.owner,
        displayOrder: index,
      }));

      Featured.upsert({}, { $set: { homeFeaturedStylists } });

      log.info(
        'Meteor.methods: feature.home.stylist',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
  'featured.home.stylists.update': function updateFeaturedStylistsOnHome(stylists) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }
    check(stylists, Array);

    try {
      Featured.upsert({}, { $set: { homeFeaturedStylists: stylists } });

      log.info(
        'Meteor.methods: featured.home.stylists.update',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(stylists)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['featured.home.stylists', 'feature.home.stylist', 'featured.home.stylists.update'],
  limit: 5,
  timeRange: 1000,
});
