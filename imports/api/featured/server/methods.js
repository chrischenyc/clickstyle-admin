import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../../stylists/stylists';
import Profiles from '../../profiles/profiles';
import Suburbs from '../../suburbs/suburbs';
import Featured from '../../featured/featured';

Meteor.methods({
  'featured.home.stylists': function searchFeaturedStylistsOnHome(data) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }
    check(data, Object);

    const { suburb: suburbName } = data;
    if (suburbName) {
      check(suburbName, String);
    }

    try {
      // final query selector, only look for published stylists
      let selector = {
        published: true,
      };

      // add query selector by available suburbs
      const homeFeaturedStylists = Featured.findOne().homeFeaturedStylists;

      if (suburbName) {
        const suburbsSelector = { name: RegExp(suburbName, 'i') };
        const suburbIds = Suburbs.find(suburbsSelector)
          .fetch()
          .map(suburb => suburb._id);

        selector = { ...selector, ...{ 'areas.availableSuburbs': { $in: suburbIds } } };
      } else {
        // query home featured
        const stylistIds = homeFeaturedStylists.map(stylist => stylist.owner);

        selector = { ...selector, owner: { $in: stylistIds } };
      }

      // query Stylists
      const stylists = Stylists.find(selector, {
        fields: { owner: 1, 'services.name': 1 },
      }).fetch();

      // query Profiles
      const userIds = stylists.map(stylist => stylist.owner);
      const profiles = Profiles.find(
        { owner: { $in: userIds } },
        {
          fields: {
            owner: 1,
            name: 1,
            'address.state': 1,
            'address.suburb': 1,
            photo: 1,
          },
        },
      ).fetch();

      const unsorted = stylists.map((stylist, index) => {
        const filteredProfiles = profiles.filter(profile => profile.owner === stylist.owner);

        // insert display order
        let displayOrder = index;
        if (suburbName) {
          // TODO: display order when search in suburb
          displayOrder = index;
        } else {
          displayOrder = homeFeaturedStylists.filter(featured => featured.owner === stylist.owner)[0].displayOrder;
        }

        return {
          ...stylist,
          displayOrder,
          profile: filteredProfiles.length > 0 && filteredProfiles[0],
        };
      });

      return _.orderBy(unsorted, ['displayOrder']);
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
