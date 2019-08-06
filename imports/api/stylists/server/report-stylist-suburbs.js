import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import Profiles from '../../profiles/profiles';

export default function geoReport() {
  if (
    Meteor.isClient
    && !Roles.userIsInRole(Meteor.userId(), [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  try {
    const profiles = Profiles.find({ postcode: { $exists: 1 } }).fetch();

    let postcodes = [];

    profiles.forEach((profile) => {
      if (postcodes.filter(postcode => postcode.postcode === profile.postcode).length === 0) {
        postcodes.push({ postcode: profile.postcode, users: 1 });
      } else {
        postcodes = postcodes.map((postcode) => {
          if (postcode.postcode === profile.postcode) {
            return { ...postcode, users: postcode.users + 1 };
          }
          return postcode;
        });
      }
    });

    return postcodes.sort((a, b) => b.users - a.users);
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
